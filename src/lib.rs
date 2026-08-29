use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};
use std::fmt::{Display, Formatter};
use std::fs;
use std::path::{Path, PathBuf};
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum RecipeSystem {
    Mealie,
    Tandoor,
}

impl Display for RecipeSystem {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.write_str(match self {
            Self::Mealie => "mealie",
            Self::Tandoor => "tandoor",
        })
    }
}

impl FromStr for RecipeSystem {
    type Err = String;
    fn from_str(value: &str) -> Result<Self, Self::Err> {
        match value.to_ascii_lowercase().as_str() {
            "mealie" => Ok(Self::Mealie),
            "tandoor" => Ok(Self::Tandoor),
            _ => Err(format!(
                "unsupported system '{value}'; use mealie or tandoor"
            )),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ExportSpec {
    pub system: RecipeSystem,
    pub folder: PathBuf,
}

impl FromStr for ExportSpec {
    type Err = String;
    fn from_str(value: &str) -> Result<Self, Self::Err> {
        let (system, folder) = value
            .split_once(':')
            .ok_or_else(|| "expected SYSTEM:FOLDER, such as mealie:./export".to_string())?;
        if folder.trim().is_empty() {
            return Err("the export folder cannot be empty".into());
        }
        Ok(Self {
            system: system.parse()?,
            folder: PathBuf::from(folder),
        })
    }
}

pub struct CheckOptions {
    pub source: ExportSpec,
    pub destination: ExportSpec,
    pub report: PathBuf,
    pub inventory: PathBuf,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recipe {
    pub id: String,
    pub name: String,
    pub system: RecipeSystem,
    pub source_file: String,
    pub ingredients: Vec<String>,
    pub instructions: Vec<String>,
    pub tags: Vec<String>,
    pub servings: Option<String>,
    pub owner: Option<String>,
    pub household: Option<String>,
    pub image: ImageCheck,
    pub unmapped_fields: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageCheck {
    pub declared_path: Option<String>,
    pub status: String,
    pub sha256: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Collision {
    pub source_id: String,
    pub source_name: String,
    pub destination_id: String,
    pub destination_name: String,
    pub confidence: String,
    pub score: f64,
    pub reasons: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Warning {
    pub file: String,
    pub message: String,
    /// True when a recipe JSON file could not be read. The generated outputs
    /// are useful, but do not describe every file in the selected exports.
    pub affects_completeness: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Summary {
    pub source_recipes: usize,
    pub destination_recipes: usize,
    #[serde(rename = "possible_duplicates")]
    pub collisions: usize,
    pub missing_images: usize,
    pub unmapped_fields: usize,
    pub ownership_reviews: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Outputs {
    pub report: PathBuf,
    pub inventory: PathBuf,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CheckResult {
    pub source_system: RecipeSystem,
    pub destination_system: RecipeSystem,
    pub summary: Summary,
    #[serde(rename = "possible_duplicates")]
    pub collisions: Vec<Collision>,
    pub source_recipes: Vec<Recipe>,
    pub destination_recipes: Vec<Recipe>,
    pub warnings: Vec<Warning>,
    pub outputs: Outputs,
}

pub fn run_check(options: CheckOptions) -> Result<CheckResult, String> {
    let source_root = validate_export(&options.source)?;
    let destination_root = validate_export(&options.destination)?;
    validate_output_paths(&options, &[source_root, destination_root])?;
    let (source_recipes, mut warnings) = read_export(&options.source)?;
    let (destination_recipes, destination_warnings) = read_export(&options.destination)?;
    warnings.extend(destination_warnings);
    if source_recipes.is_empty() {
        return Err(format!(
            "no recipes were found in {}. Check the folder and export type",
            options.source.folder.display()
        ));
    }
    if destination_recipes.is_empty() {
        warnings.push(Warning {
            file: options.destination.folder.display().to_string(),
            message: "the destination has no recipes; possible duplicate results are empty".into(),
            affects_completeness: false,
        });
    }
    let collisions = find_collisions(&source_recipes, &destination_recipes);
    let missing_images = source_recipes
        .iter()
        .filter(|r| {
            matches!(
                r.image.status.as_str(),
                "missing" | "external" | "outside_export"
            )
        })
        .count();
    let unmapped_fields = source_recipes.iter().map(|r| r.unmapped_fields.len()).sum();
    let ownership_reviews = source_recipes
        .iter()
        .filter(|r| r.owner.is_none() || r.household.is_some())
        .count();
    let summary = Summary {
        source_recipes: source_recipes.len(),
        destination_recipes: destination_recipes.len(),
        collisions: collisions.len(),
        missing_images,
        unmapped_fields,
        ownership_reviews,
    };
    let result = CheckResult {
        source_system: options.source.system,
        destination_system: options.destination.system,
        summary,
        collisions,
        source_recipes,
        destination_recipes,
        warnings,
        outputs: Outputs {
            report: options.report.clone(),
            inventory: options.inventory.clone(),
        },
    };
    write_parent(&options.report)?;
    write_parent(&options.inventory)?;
    fs::write(&options.report, render_report(&result))
        .map_err(|e| format!("could not write report {}: {e}", options.report.display()))?;
    fs::write(
        &options.inventory,
        serde_json::to_vec_pretty(&result).map_err(|e| e.to_string())?,
    )
    .map_err(|e| {
        format!(
            "could not write inventory {}: {e}",
            options.inventory.display()
        )
    })?;
    Ok(result)
}

fn validate_export(spec: &ExportSpec) -> Result<PathBuf, String> {
    if !spec.folder.exists() {
        return Err(format!(
            "{} export folder does not exist: {}",
            spec.system,
            spec.folder.display()
        ));
    }
    if !spec.folder.is_dir() {
        return Err(format!(
            "{} export path is not a folder: {}",
            spec.system,
            spec.folder.display()
        ));
    }
    fs::canonicalize(&spec.folder).map_err(|e| {
        format!(
            "could not resolve {} export folder {}: {e}",
            spec.system,
            spec.folder.display()
        )
    })
}

/// Resolve a path for safety comparisons without creating its parent. Existing
/// ancestors are canonicalized so a symlink cannot make an output appear to be
/// outside an export when it is not.
fn path_for_comparison(path: &Path) -> Result<PathBuf, String> {
    let absolute = if path.is_absolute() {
        path.to_path_buf()
    } else {
        std::env::current_dir()
            .map_err(|e| format!("could not resolve the current folder: {e}"))?
            .join(path)
    };
    let normalized = normalize_path(&absolute);
    if normalized.exists() {
        return fs::canonicalize(&normalized)
            .map_err(|e| format!("could not resolve {}: {e}", normalized.display()));
    }

    let mut existing = normalized.as_path();
    let mut tail = Vec::new();
    while !existing.exists() {
        let Some(name) = existing.file_name() else {
            return Err(format!("could not resolve {}", normalized.display()));
        };
        tail.push(name.to_os_string());
        let Some(parent) = existing.parent() else {
            return Err(format!("could not resolve {}", normalized.display()));
        };
        existing = parent;
    }
    let mut resolved = fs::canonicalize(existing)
        .map_err(|e| format!("could not resolve {}: {e}", existing.display()))?;
    for component in tail.iter().rev() {
        resolved.push(component);
    }
    Ok(resolved)
}

fn normalize_path(path: &Path) -> PathBuf {
    use std::path::Component;

    let mut normalized = PathBuf::new();
    for component in path.components() {
        match component {
            Component::CurDir => {}
            Component::ParentDir => {
                normalized.pop();
            }
            other => normalized.push(other.as_os_str()),
        }
    }
    normalized
}

fn paths_overlap(left: &Path, right: &Path) -> bool {
    left.starts_with(right) || right.starts_with(left)
}

fn validate_output_paths(options: &CheckOptions, export_roots: &[PathBuf]) -> Result<(), String> {
    let report = path_for_comparison(&options.report)?;
    let inventory = path_for_comparison(&options.inventory)?;
    for (label, output) in [("report", &report), ("inventory", &inventory)] {
        for root in export_roots {
            if paths_overlap(output, root) {
                return Err(format!(
                    "{label} path overlaps a selected export: {}. Choose an output folder outside both exports",
                    output.display()
                ));
            }
        }
    }
    if paths_overlap(&report, &inventory) {
        return Err(format!(
            "report and inventory paths overlap: {} and {}. Choose two different output files",
            report.display(),
            inventory.display()
        ));
    }
    for (label, output) in [("report", &report), ("inventory", &inventory)] {
        if output.exists() && output.is_file() {
            for root in export_roots {
                let mut inputs = Vec::new();
                collect_files(root, &mut inputs)
                    .map_err(|e| format!("could not inspect {}: {e}", root.display()))?;
                if inputs.iter().any(|input| same_file(output, input)) {
                    return Err(format!(
                        "{label} path refers to an input file: {}. Choose an output file outside both exports",
                        output.display()
                    ));
                }
            }
        }
    }
    Ok(())
}

fn collect_files(folder: &Path, output: &mut Vec<PathBuf>) -> std::io::Result<()> {
    for entry in fs::read_dir(folder)? {
        let entry = entry?;
        let path = entry.path();
        let kind = entry.file_type()?;
        if kind.is_dir() {
            collect_files(&path, output)?;
        } else if kind.is_file() {
            output.push(path);
        }
    }
    Ok(())
}

#[cfg(unix)]
fn same_file(left: &Path, right: &Path) -> bool {
    use std::os::unix::fs::MetadataExt;

    match (fs::metadata(left), fs::metadata(right)) {
        (Ok(left), Ok(right)) => left.dev() == right.dev() && left.ino() == right.ino(),
        _ => false,
    }
}

#[cfg(not(unix))]
fn same_file(left: &Path, right: &Path) -> bool {
    match (fs::canonicalize(left), fs::canonicalize(right)) {
        (Ok(left), Ok(right)) => left == right,
        _ => false,
    }
}

fn write_parent(path: &Path) -> Result<(), String> {
    if let Some(parent) = path.parent().filter(|p| !p.as_os_str().is_empty()) {
        fs::create_dir_all(parent)
            .map_err(|e| format!("could not create {}: {e}", parent.display()))?;
    }
    Ok(())
}

fn read_export(spec: &ExportSpec) -> Result<(Vec<Recipe>, Vec<Warning>), String> {
    let mut files = Vec::new();
    collect_json(&spec.folder, &mut files)
        .map_err(|e| format!("could not read {}: {e}", spec.folder.display()))?;
    files.sort();
    let mut recipes = Vec::new();
    let mut warnings = Vec::new();
    for path in files {
        let bytes = match fs::read(&path) {
            Ok(bytes) => bytes,
            Err(error) => {
                warnings.push(Warning {
                    file: path.display().to_string(),
                    message: format!("could not read JSON: {error}"),
                    affects_completeness: true,
                });
                continue;
            }
        };
        let value: Value = match serde_json::from_slice(&bytes) {
            Ok(value) => value,
            Err(error) => {
                warnings.push(Warning {
                    file: path.display().to_string(),
                    message: format!("invalid JSON: {error}"),
                    affects_completeness: true,
                });
                continue;
            }
        };
        let candidates: Vec<&Value> = if let Some(items) = value.as_array() {
            items.iter().collect()
        } else if let Some(items) = value
            .get("recipes")
            .or_else(|| value.get("items"))
            .and_then(Value::as_array)
        {
            items.iter().collect()
        } else {
            vec![&value]
        };
        for (index, candidate) in candidates.into_iter().enumerate() {
            if let Some(recipe) = parse_recipe(candidate, spec, &path, index)? {
                recipes.push(recipe);
            }
        }
    }
    recipes.sort_by_key(|recipe| recipe.name.to_lowercase());
    Ok((recipes, warnings))
}

fn collect_json(folder: &Path, output: &mut Vec<PathBuf>) -> std::io::Result<()> {
    for entry in fs::read_dir(folder)? {
        let path = entry?.path();
        if path.is_dir() {
            collect_json(&path, output)?;
        } else if path
            .extension()
            .and_then(|x| x.to_str())
            .is_some_and(|x| x.eq_ignore_ascii_case("json"))
        {
            output.push(path);
        }
    }
    Ok(())
}

fn parse_recipe(
    value: &Value,
    spec: &ExportSpec,
    file: &Path,
    index: usize,
) -> Result<Option<Recipe>, String> {
    let root = value
        .get("recipe")
        .filter(|v| v.is_object())
        .unwrap_or(value);
    let Some(object) = root.as_object() else {
        return Ok(None);
    };
    let Some(name) = string_at(root, &["name", "title"]) else {
        return Ok(None);
    };
    if name.trim().is_empty() {
        return Ok(None);
    }
    let ingredients = strings_at(
        root,
        &["recipeIngredient", "ingredients"],
        extract_ingredient,
    );
    let instructions = strings_at(
        root,
        &["recipeInstructions", "instructions", "steps"],
        extract_instruction,
    );
    let tags = strings_at(root, &["tags", "keywords"], extract_label);
    let servings = string_at(root, &["recipeYield", "servings"]);
    let owner = string_at(root, &["owner", "created_by", "createdBy"]);
    let household = string_at(root, &["household", "space", "group"]);
    let declared_image = string_at(root, &["image", "image_path", "imagePath", "recipe_image"]);
    let image = inspect_image(declared_image, file, &spec.folder)?;
    let known = known_fields(spec.system);
    let mut unmapped_fields: Vec<String> = object
        .keys()
        .filter(|key| !known.contains(key.as_str()))
        .map(|key| key.to_string())
        .collect();
    if household.is_some() {
        unmapped_fields.push("household ownership".into());
    }
    unmapped_fields.sort();
    unmapped_fields.dedup();
    let relative = file
        .strip_prefix(&spec.folder)
        .unwrap_or(file)
        .display()
        .to_string();
    let id = format!(
        "{}:{}{}",
        spec.system,
        relative,
        if index == 0 {
            String::new()
        } else {
            format!("#{index}")
        }
    );
    Ok(Some(Recipe {
        id,
        name,
        system: spec.system,
        source_file: relative,
        ingredients,
        instructions,
        tags,
        servings,
        owner,
        household,
        image,
        unmapped_fields,
    }))
}

fn known_fields(system: RecipeSystem) -> BTreeSet<&'static str> {
    let common = [
        "id",
        "name",
        "title",
        "description",
        "recipeIngredient",
        "ingredients",
        "recipeInstructions",
        "instructions",
        "steps",
        "tags",
        "keywords",
        "recipeYield",
        "servings",
        "owner",
        "created_by",
        "createdBy",
        "household",
        "space",
        "group",
        "image",
        "image_path",
        "imagePath",
        "recipe_image",
        "slug",
        "dateCreated",
        "dateModified",
    ];
    let extra = match system {
        RecipeSystem::Mealie => vec![
            "orgURL",
            "recipeCategory",
            "prepTime",
            "cookTime",
            "totalTime",
            "nutrition",
            "settings",
            "assets",
        ],
        RecipeSystem::Tandoor => vec![
            "working_time",
            "waiting_time",
            "internal",
            "source_url",
            "properties",
            "nutrition",
            "created_at",
            "updated_at",
        ],
    };
    common.into_iter().chain(extra).collect()
}

fn string_at(value: &Value, keys: &[&str]) -> Option<String> {
    for key in keys {
        if let Some(found) = value.get(key) {
            match found {
                Value::String(s) if !s.trim().is_empty() => return Some(s.trim().to_string()),
                Value::Number(n) => return Some(n.to_string()),
                Value::Object(o) => {
                    for nested in ["name", "username", "label"] {
                        if let Some(Value::String(s)) = o.get(nested) {
                            if !s.trim().is_empty() {
                                return Some(s.trim().to_string());
                            }
                        }
                    }
                }
                _ => {}
            }
        }
    }
    None
}

fn strings_at(
    value: &Value,
    keys: &[&str],
    extractor: fn(&Value) -> Option<String>,
) -> Vec<String> {
    for key in keys {
        if let Some(found) = value.get(key) {
            let mut result: Vec<String> = match found {
                Value::Array(items) => items.iter().filter_map(extractor).collect(),
                Value::String(text) if key == &"keywords" => text
                    .split(',')
                    .map(str::trim)
                    .filter(|s| !s.is_empty())
                    .map(str::to_string)
                    .collect(),
                other => extractor(other).into_iter().collect(),
            };
            result.retain(|s| !s.trim().is_empty());
            return result;
        }
    }
    Vec::new()
}

fn extract_label(value: &Value) -> Option<String> {
    value
        .as_str()
        .map(str::to_string)
        .or_else(|| string_at(value, &["name", "label"]))
}
fn extract_instruction(value: &Value) -> Option<String> {
    value
        .as_str()
        .map(str::to_string)
        .or_else(|| string_at(value, &["text", "instruction", "name"]))
}
fn extract_ingredient(value: &Value) -> Option<String> {
    if let Some(text) = value.as_str() {
        return Some(text.to_string());
    }
    if let Some(text) = string_at(value, &["display", "note", "text"]) {
        return Some(text);
    }
    let object = value.as_object()?;
    let food = object
        .get("food")
        .and_then(|v| string_at(v, &["name"]))
        .or_else(|| string_at(value, &["name"]));
    let amount = string_at(value, &["amount"]);
    let unit = object.get("unit").and_then(|v| string_at(v, &["name"]));
    let combined = [amount, unit, food]
        .into_iter()
        .flatten()
        .collect::<Vec<_>>()
        .join(" ");
    (!combined.is_empty()).then_some(combined)
}

fn inspect_image(
    declared: Option<String>,
    json_file: &Path,
    export_root: &Path,
) -> Result<ImageCheck, String> {
    let Some(raw) = declared else {
        return Ok(ImageCheck {
            declared_path: None,
            status: "not_declared".into(),
            sha256: None,
        });
    };
    if raw.starts_with("http://") || raw.starts_with("https://") {
        return Ok(ImageCheck {
            declared_path: Some(raw),
            status: "external".into(),
            sha256: None,
        });
    }
    let candidate = PathBuf::from(&raw);
    // An export can contain stale or hostile paths. Hash only files that resolve
    // inside the folder the person explicitly selected; canonical paths also
    // prevent a symlink within that folder from escaping it.
    if candidate.is_absolute() {
        return Ok(restricted_image(raw));
    }
    let root = fs::canonicalize(export_root).map_err(|e| {
        format!(
            "could not resolve export folder {}: {e}",
            export_root.display()
        )
    })?;
    let paths = [
        json_file.parent().unwrap_or(export_root).join(&candidate),
        export_root.join(&candidate),
    ];
    let existing = paths.iter().find_map(|path| {
        path.is_file()
            .then(|| fs::canonicalize(path).ok())
            .flatten()
            .filter(|resolved| resolved.starts_with(&root))
    });
    let Some(path) = existing else {
        let declared_path = Some(raw);
        let escapes_root = paths.iter().any(|path| {
            path.exists()
                && fs::canonicalize(path)
                    .map(|resolved| !resolved.starts_with(&root))
                    .unwrap_or(false)
        });
        return Ok(ImageCheck {
            declared_path,
            status: if escapes_root {
                "outside_export"
            } else {
                "missing"
            }
            .into(),
            sha256: None,
        });
    };
    let bytes =
        fs::read(&path).map_err(|e| format!("could not hash image {}: {e}", path.display()))?;
    let hash = format!("{:x}", Sha256::digest(bytes));
    Ok(ImageCheck {
        declared_path: Some(raw),
        status: "present".into(),
        sha256: Some(hash),
    })
}

fn restricted_image(raw: String) -> ImageCheck {
    ImageCheck {
        declared_path: Some(raw),
        status: "outside_export".into(),
        sha256: None,
    }
}

fn find_collisions(source: &[Recipe], destination: &[Recipe]) -> Vec<Collision> {
    let mut collisions = Vec::new();
    for from in source {
        let mut best: Option<Collision> = None;
        for to in destination {
            let mut reasons = Vec::new();
            let name_score = jaccard(&tokens(&from.name), &tokens(&to.name));
            let ingredient_score = jaccard(
                &tokens(&from.ingredients.join(" ")),
                &tokens(&to.ingredients.join(" ")),
            );
            let exact_name = normalize(&from.name) == normalize(&to.name);
            let same_image = from.image.sha256.is_some() && from.image.sha256 == to.image.sha256;
            let score = if exact_name || same_image {
                1.0
            } else {
                name_score * 0.65 + ingredient_score * 0.35
            };
            if exact_name {
                reasons.push("same normalized name".into());
            } else if name_score >= 0.5 {
                reasons.push("similar name".into());
            }
            if ingredient_score >= 0.6 {
                reasons.push("similar ingredient list".into());
            }
            if same_image {
                reasons.push("same image hash".into());
            }
            if score >= 0.62 {
                let candidate = Collision {
                    source_id: from.id.clone(),
                    source_name: from.name.clone(),
                    destination_id: to.id.clone(),
                    destination_name: to.name.clone(),
                    confidence: if score >= 0.9 {
                        "high".into()
                    } else {
                        "review".into()
                    },
                    score: (score * 100.0).round() / 100.0,
                    reasons,
                };
                if best
                    .as_ref()
                    .map_or(true, |current| candidate.score > current.score)
                {
                    best = Some(candidate);
                }
            }
        }
        if let Some(collision) = best {
            collisions.push(collision);
        }
    }
    collisions.sort_by(|a, b| {
        b.score
            .total_cmp(&a.score)
            .then_with(|| a.source_name.cmp(&b.source_name))
    });
    collisions
}

fn normalize(value: &str) -> String {
    value
        .chars()
        .filter(|c| c.is_alphanumeric())
        .flat_map(char::to_lowercase)
        .collect()
}
fn tokens(value: &str) -> BTreeSet<String> {
    value
        .split(|c: char| !c.is_alphanumeric())
        .map(str::to_lowercase)
        .filter(|word| word.len() > 1 && !["and", "with", "the", "for"].contains(&word.as_str()))
        .collect()
}
fn jaccard(a: &BTreeSet<String>, b: &BTreeSet<String>) -> f64 {
    if a.is_empty() || b.is_empty() {
        return 0.0;
    }
    a.intersection(b).count() as f64 / a.union(b).count() as f64
}

fn render_report(result: &CheckResult) -> String {
    let mut text = format!("# Recipe library move checklist\n\nMove: **{} → {}**\n\n## Check summary\n\n- Moving recipes: {}\n- Existing recipes: {}\n- Possible duplicates: {}\n- Missing or external images: {}\n- Fields to review: {}\n- Ownership checks: {}\n\n", result.source_system, result.destination_system, result.summary.source_recipes, result.summary.destination_recipes, result.summary.collisions, result.summary.missing_images, result.summary.unmapped_fields, result.summary.ownership_reviews);
    text.push_str("## Possible duplicates\n\n");
    if result.collisions.is_empty() {
        text.push_str(
            "No possible duplicates were found. Review names manually before importing.\n\n",
        );
    } else {
        text.push_str("| Moving recipe | Existing recipe | Confidence | Evidence |\n| --- | --- | --- | --- |\n");
        for item in &result.collisions {
            text.push_str(&format!(
                "| {} | {} | {} ({:.0}%) | {} |\n",
                escape_md(&item.source_name),
                escape_md(&item.destination_name),
                item.confidence,
                item.score * 100.0,
                item.reasons.join(", ")
            ));
        }
        text.push('\n');
    }
    text.push_str("## Images to find\n\n");
    let missing: Vec<_> = result
        .source_recipes
        .iter()
        .filter(|r| {
            matches!(
                r.image.status.as_str(),
                "missing" | "external" | "outside_export"
            )
        })
        .collect();
    if missing.is_empty() {
        text.push_str("Every declared local image was found.\n\n");
    } else {
        for recipe in missing {
            text.push_str(&format!(
                "- [ ] **{}** — {} image `{}`\n",
                escape_md(&recipe.name),
                recipe.image.status,
                recipe.image.declared_path.as_deref().unwrap_or("unknown")
            ));
        }
        text.push('\n');
    }
    text.push_str("## Fields to decide\n\n");
    let mut field_map: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
    for recipe in &result.source_recipes {
        for field in &recipe.unmapped_fields {
            field_map.entry(field).or_default().push(&recipe.name);
        }
    }
    if field_map.is_empty() {
        text.push_str("No unknown source fields were found.\n\n");
    } else {
        for (field, names) in field_map {
            text.push_str(&format!(
                "- [ ] Decide how `{}` should move. Found on: {}.\n",
                escape_md(field),
                names
                    .iter()
                    .map(|n| escape_md(n))
                    .collect::<Vec<_>>()
                    .join(", ")
            ));
        }
        text.push('\n');
    }
    text.push_str("## Input warnings\n\n");
    if result.warnings.is_empty() {
        text.push_str("Every JSON file was read.\n\n");
    } else {
        let partial = result
            .warnings
            .iter()
            .filter(|warning| warning.affects_completeness)
            .count();
        if partial > 0 {
            text.push_str(&format!(
                "**This checklist is partial.** {partial} JSON file(s) could not be read. The CLI returns exit code 1 so scripts can stop before importing. Fix the files below and run the check again.\n\n"
            ));
        }
        for warning in &result.warnings {
            text.push_str(&format!(
                "- [ ] `{}` — {}\n",
                escape_md(&warning.file),
                escape_md(&warning.message)
            ));
        }
        text.push('\n');
    }
    text.push_str("## Family review\n\n");
    let mut family_review_count = 0;
    for recipe in &result.source_recipes {
        if recipe.owner.is_none() {
            family_review_count += 1;
            text.push_str(&format!(
                "- [ ] Choose an owner for **{}**.\n",
                escape_md(&recipe.name)
            ));
        }
        if let Some(household) = &recipe.household {
            family_review_count += 1;
            text.push_str(&format!(
                "- [ ] Recreate household access for **{}** (was `{}`).\n",
                escape_md(&recipe.name),
                escape_md(household)
            ));
        }
    }
    if family_review_count == 0 {
        text.push_str("No owner or household access checks were found.\n");
    }
    text.push_str("\n## Before importing\n\n- [ ] Back up both original export folders.\n- [ ] Resolve every possible duplicate above.\n- [ ] Locate missing images or accept that they will be absent.\n- [ ] Assign owners and household access.\n- [ ] Import a small test batch first.\n- [ ] Keep this report beside the untouched exports.\n\nThis checker reads exports only. Similarity is a review hint, not proof of a duplicate. Image hashes do not grant permission to copy content.\n");
    text
}

fn escape_md(value: &str) -> String {
    value.replace('|', "\\|").replace('\n', " ")
}

pub fn run_demo() -> Result<(CheckResult, PathBuf), String> {
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();
    let root = std::env::temp_dir().join(format!(
        "recipe-move-check-demo-{}-{stamp}",
        std::process::id()
    ));
    let mealie = root.join("mealie");
    let tandoor = root.join("tandoor");
    fs::create_dir_all(mealie.join("lemon-pasta")).map_err(|e| e.to_string())?;
    fs::create_dir_all(mealie.join("lentil-soup")).map_err(|e| e.to_string())?;
    fs::create_dir_all(tandoor.join("recipes")).map_err(|e| e.to_string())?;
    fs::write(
        mealie.join("lemon-pasta/photo.jpg"),
        include_bytes!("../examples/mealie/lemon-pasta/photo.jpg"),
    )
    .map_err(|e| e.to_string())?;
    fs::write(
        tandoor.join("recipes/lemon.jpg"),
        include_bytes!("../examples/tandoor/recipes/lemon.jpg"),
    )
    .map_err(|e| e.to_string())?;
    fs::write(
        mealie.join("lemon-pasta/recipe.json"),
        include_str!("../examples/mealie/lemon-pasta/recipe.json"),
    )
    .map_err(|e| e.to_string())?;
    fs::write(
        mealie.join("lentil-soup/recipe.json"),
        include_str!("../examples/mealie/lentil-soup/recipe.json"),
    )
    .map_err(|e| e.to_string())?;
    fs::write(
        tandoor.join("recipes/lemon.json"),
        include_str!("../examples/tandoor/recipes/lemon.json"),
    )
    .map_err(|e| e.to_string())?;
    fs::write(
        tandoor.join("recipes/granola.json"),
        include_str!("../examples/tandoor/recipes/granola.json"),
    )
    .map_err(|e| e.to_string())?;
    let result = run_check(CheckOptions {
        source: ExportSpec {
            system: RecipeSystem::Mealie,
            folder: mealie,
        },
        destination: ExportSpec {
            system: RecipeSystem::Tandoor,
            folder: tandoor,
        },
        report: root.join("move-check.md"),
        inventory: root.join("neutral-inventory.json"),
    })?;
    Ok((result, root))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn documented_example_finds_collision_and_review_items() {
        let (result, root) = run_demo().expect("demo runs");
        assert_eq!(result.summary.source_recipes, 2);
        assert_eq!(result.summary.destination_recipes, 2);
        assert_eq!(result.summary.collisions, 1);
        assert_eq!(result.collisions[0].confidence, "high");
        assert_eq!(result.summary.missing_images, 1);
        assert!(result.summary.unmapped_fields >= 2);
        assert!(result.outputs.report.exists());
        assert!(result.outputs.inventory.exists());
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn image_hash_can_identify_same_image() {
        let (result, root) = run_demo().expect("demo runs");
        assert!(result.collisions[0]
            .reasons
            .contains(&"same image hash".to_string()));
        fs::remove_dir_all(root).ok();
    }

    #[test]
    fn empty_export_has_a_next_step() {
        let temp = tempdir().unwrap();
        let source = temp.path().join("source");
        let destination = temp.path().join("destination");
        fs::create_dir(&source).unwrap();
        fs::create_dir(&destination).unwrap();
        fs::write(destination.join("recipe.json"), r#"{"name":"Toast"}"#).unwrap();
        let error = run_check(CheckOptions {
            source: ExportSpec {
                system: RecipeSystem::Mealie,
                folder: source,
            },
            destination: ExportSpec {
                system: RecipeSystem::Tandoor,
                folder: destination,
            },
            report: temp.path().join("report.md"),
            inventory: temp.path().join("inventory.json"),
        })
        .unwrap_err();
        assert!(error.contains("no recipes were found"));
        assert!(error.contains("Check the folder"));
    }

    #[test]
    fn empty_destination_produces_a_useful_zero_collision_report() {
        let temp = tempdir().unwrap();
        let source = temp.path().join("source");
        let destination = temp.path().join("destination");
        fs::create_dir(&source).unwrap();
        fs::create_dir(&destination).unwrap();
        fs::write(source.join("recipe.json"), r#"{"name":"Toast"}"#).unwrap();
        let result = run_check(CheckOptions {
            source: ExportSpec {
                system: RecipeSystem::Mealie,
                folder: source,
            },
            destination: ExportSpec {
                system: RecipeSystem::Tandoor,
                folder: destination,
            },
            report: temp.path().join("report.md"),
            inventory: temp.path().join("inventory.json"),
        })
        .unwrap();
        assert_eq!(result.summary.destination_recipes, 0);
        assert_eq!(result.summary.collisions, 0);
        assert!(result.warnings[0]
            .message
            .contains("destination has no recipes"));
    }

    #[test]
    fn export_spec_rejects_unknown_systems() {
        let error = "paprika:./export".parse::<ExportSpec>().unwrap_err();
        assert!(error.contains("use mealie or tandoor"));
    }

    #[test]
    fn image_paths_cannot_escape_the_selected_export_folder() {
        let temp = tempdir().unwrap();
        let source = temp.path().join("source");
        let destination = temp.path().join("destination");
        fs::create_dir(&source).unwrap();
        fs::create_dir(&destination).unwrap();
        let outside = temp.path().join("not-an-export-image.jpg");
        fs::write(&outside, b"private image bytes").unwrap();
        fs::write(
            source.join("recipe.json"),
            format!(
                r#"{{"name":"Absolute probe","image":"{}"}}"#,
                outside.display()
            ),
        )
        .unwrap();
        fs::write(
            source.join("traversal.json"),
            r#"{"name":"Traversal probe","image":"../not-an-export-image.jpg"}"#,
        )
        .unwrap();
        let result = run_check(CheckOptions {
            source: ExportSpec {
                system: RecipeSystem::Mealie,
                folder: source,
            },
            destination: ExportSpec {
                system: RecipeSystem::Tandoor,
                folder: destination,
            },
            report: temp.path().join("report.md"),
            inventory: temp.path().join("inventory.json"),
        })
        .unwrap();
        assert_eq!(result.summary.missing_images, 2);
        assert!(result
            .source_recipes
            .iter()
            .all(|recipe| recipe.image.status == "outside_export"));
        assert!(result
            .source_recipes
            .iter()
            .all(|recipe| recipe.image.sha256.is_none()));
    }

    #[test]
    fn output_paths_cannot_overlap_exports_or_each_other() {
        let temp = tempdir().unwrap();
        let source = temp.path().join("source");
        let destination = temp.path().join("destination");
        fs::create_dir(&source).unwrap();
        fs::create_dir(&destination).unwrap();
        let input = source.join("recipe.json");
        fs::write(&input, r#"{"name":"Moving toast"}"#).unwrap();
        fs::write(
            destination.join("recipe.json"),
            r#"{"name":"Existing toast"}"#,
        )
        .unwrap();
        let before = fs::read(&input).unwrap();

        let inside_export = run_check(CheckOptions {
            source: ExportSpec {
                system: RecipeSystem::Mealie,
                folder: source.clone(),
            },
            destination: ExportSpec {
                system: RecipeSystem::Tandoor,
                folder: destination.clone(),
            },
            report: input.clone(),
            inventory: temp.path().join("inventory.json"),
        })
        .unwrap_err();
        assert!(inside_export.contains("report path overlaps a selected export"));
        assert_eq!(fs::read(&input).unwrap(), before);

        let shared = temp.path().join("shared-output.json");
        let aliased_outputs = run_check(CheckOptions {
            source: ExportSpec {
                system: RecipeSystem::Mealie,
                folder: source,
            },
            destination: ExportSpec {
                system: RecipeSystem::Tandoor,
                folder: destination,
            },
            report: shared.clone(),
            inventory: shared,
        })
        .unwrap_err();
        assert!(aliased_outputs.contains("report and inventory paths overlap"));
    }

    #[test]
    fn malformed_recipe_is_prominent_in_partial_report_and_empty_family_review_explains_itself() {
        let temp = tempdir().unwrap();
        let source = temp.path().join("source");
        let destination = temp.path().join("destination");
        fs::create_dir(&source).unwrap();
        fs::create_dir(&destination).unwrap();
        fs::write(
            source.join("valid.json"),
            r#"{"name":"Moving toast","owner":"Ada"}"#,
        )
        .unwrap();
        fs::write(source.join("broken.json"), "{bad json").unwrap();
        fs::write(
            destination.join("recipe.json"),
            r#"{"name":"Existing toast"}"#,
        )
        .unwrap();
        let report = temp.path().join("report.md");
        let result = run_check(CheckOptions {
            source: ExportSpec {
                system: RecipeSystem::Mealie,
                folder: source,
            },
            destination: ExportSpec {
                system: RecipeSystem::Tandoor,
                folder: destination,
            },
            report: report.clone(),
            inventory: temp.path().join("inventory.json"),
        })
        .unwrap();
        assert_eq!(result.warnings.len(), 1);
        assert!(result.warnings[0].affects_completeness);
        let checklist = fs::read_to_string(report).unwrap();
        assert!(checklist.contains("## Input warnings"));
        assert!(checklist.contains("broken.json"));
        assert!(checklist.contains("This checklist is partial"));
        assert!(checklist.contains("exit code 1"));
        assert!(checklist.contains("No owner or household access checks were found."));
    }
}
