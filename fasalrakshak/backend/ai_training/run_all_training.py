import sys
import subprocess
import os

def install_requirements():
    print("Checking and installing required packages (this may take a while)...")
    requirements = ['pandas', 'scikit-learn', 'tensorflow', 'librosa', 'transformers', 'torchaudio']
    subprocess.check_call([sys.executable, "-m", "pip", "install", *requirements])
    print("Requirements installed.")

def run_script(script_name):
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    print(f"\n{'='*60}")
    print(f"EXECUTING PIPELINE: {script_name}")
    print(f"{'='*60}")
    try:
        subprocess.check_call([sys.executable, script_path])
    except subprocess.CalledProcessError as e:
        print(f"❌ Pipeline {script_name} failed with error: {e}")

if __name__ == "__main__":
    try:
        install_requirements()
    except Exception as e:
        print(f"Warning: Failed to install requirements automatically: {e}")

    # We run the fastest ones first to guarantee we meet the 6-hour deadline for at least some
    run_script("train_tabular.py")
    run_script("train_nlp.py")
    run_script("train_audio.py")
    
    # Vision takes the longest, so it runs last.
    run_script("train_vision.py")
    
    print("\nALL TRAINING PIPELINES COMPLETED OR ATTEMPTED!")
