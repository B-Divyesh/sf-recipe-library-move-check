use clap::{Parser, Subcommand};
use recipe_library_move_check::{run_check, run_demo, CheckOptions, ExportSpec};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "recipe-move-check", version, about = "Check a Mealie or Tandoor move before importing", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Check two export folders and write a review checklist
    Check {
        /// Library to move, as mealie:FOLDER or tandoor:FOLDER
        #[arg(long, value_parser = parse_export)]
        source: ExportSpec,
        /// Existing library to compare, as mealie:FOLDER or tandoor:FOLDER
        #[arg(long, value_parser = parse_export)]
        destination: ExportSpec,
        /// Markdown checklist path
        #[arg(long, default_value = "move-check.md")]
        report: PathBuf,
        /// JSON inventory path
        #[arg(long, default_value = "neutral-inventory.json")]
        inventory: PathBuf,
        /// Print the complete check result as JSON to stdout
        #[arg(long)]
        json: bool,
    },
    /// Run the checker on bundled sample exports in a temporary sandbox
    Demo {
        /// Print the complete check result as JSON after creating the demo
        #[arg(long)]
        json: bool,
    },
}

fn parse_export(value: &str) -> Result<ExportSpec, String> {
    value.parse()
}

fn main() {
    let cli = Cli::parse();
    let exit_code = match cli.command {
        Command::Check { source, destination, report, inventory, json } => {
            run_check(CheckOptions { source, destination, report, inventory }).map(|result| {
                let partial_warnings: Vec<_> = result
                    .warnings
                    .iter()
                    .filter(|warning| warning.affects_completeness)
                    .collect();
                if json {
                    println!("{}", serde_json::to_string_pretty(&result).expect("result serializes"));
                } else {
                    if partial_warnings.is_empty() {
                        println!("Check complete: {} possible duplicate(s), {} missing image(s), {} field review item(s).", result.summary.collisions, result.summary.missing_images, result.summary.unmapped_fields);
                    } else {
                        println!("Check completed with {} input warning(s). The checklist and inventory are partial.", partial_warnings.len());
                    }
                    for warning in &result.warnings {
                        println!("Warning: {} — {}", warning.file, warning.message);
                    }
                    println!("Report: {}", result.outputs.report.display());
                    println!("Inventory: {}", result.outputs.inventory.display());
                    if !partial_warnings.is_empty() {
                        println!("Exit code: 1. Fix the input warnings and run the check again before importing.");
                    }
                }
                if partial_warnings.is_empty() { 0 } else { 1 }
            })
        }
        Command::Demo { json } => run_demo().map(|(result, root)| {
            if json {
                println!("{}", serde_json::to_string_pretty(&result).expect("result serializes"));
            } else {
                println!("Demo — sample data, nothing is saved to your libraries.");
                println!("Found {} possible duplicate(s), {} missing image(s), and {} field review item(s).", result.summary.collisions, result.summary.missing_images, result.summary.unmapped_fields);
                println!("Review the demo report: {}", result.outputs.report.display());
                println!("Delete this sandbox when finished: {}", root.display());
            }
            0
        }),
    };

    match exit_code {
        Ok(0) => {}
        Ok(code) => std::process::exit(code),
        Err(error) => {
            eprintln!("Could not complete the check: {error}");
            std::process::exit(2);
        }
    }
}
