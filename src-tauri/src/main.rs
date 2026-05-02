// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::Rng;
use std::fs;
use std::path::PathBuf;

// Cria ou acessa o arquivo ~/.divergence_meter/db.txt
fn get_db_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    let mut path = PathBuf::from(home);
    path.push(".divergence_meter");
    let _ = fs::create_dir_all(&path); // Cria a pasta se não existir
    path.push("db.txt");
    path
}

// Expõe esta função para o Javascript
#[tauri::command]
fn get_current_divergence() -> String {
    let path = get_db_path();
    if let Ok(content) = fs::read_to_string(path) {
        content.trim().to_string()
    } else {
        "0.000000".to_string()
    }
}

// Expõe esta função para o Javascript
#[tauri::command]
fn shift_divergence() -> String {
    let path = get_db_path();
    
    // Lê o valor atual ou assume 0.0 se for a primeira vez
    let current_val: f64 = fs::read_to_string(&path)
        .unwrap_or_else(|_| "0.0".to_string())
        .trim()
        .parse()
        .unwrap_or(0.0);

    // Gera o incremento e soma
    let mut rng = rand::rng();
    let shift: f64 = rng.random_range(0.0001..0.0050);
    let new_val = current_val + shift;

    // Formata com 6 casas decimais e salva
    let new_val_str = format!("{:.6}", new_val);
    let _ = fs::write(path, &new_val_str);

    new_val_str
}

#[tauri::command]
fn toggle_fullscreen(window: tauri::Window) {
    // Verifica se já está em tela cheia (retorna falso caso dê erro na leitura)
    let is_fullscreen = window.is_fullscreen().unwrap_or(false);
    
    // Inverte o estado atual
    let _ = window.set_fullscreen(!is_fullscreen);
}

fn main() {
    tauri::Builder::default()
        // ATENÇÃO: Não esqueça de adicionar a função nova aqui na lista!
        .invoke_handler(tauri::generate_handler![
            get_current_divergence, 
            shift_divergence, 
            toggle_fullscreen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
