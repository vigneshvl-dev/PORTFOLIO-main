import subprocess
import os
import sys

def run_command(command):
    print(f"Executing: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        return False

def main():
    print("=== PORTFOLIO DEPLOYMENT FIX ===")
    
    # 1. Git Add
    if not run_command("git add ."):
        print("Failed to add files.")
        return

    # 2. Git Commit
    commit_msg = "Update portfolio: Advanced Achievement Collage and Education Section"
    if not run_command(f'git commit -m "{commit_msg}"'):
        print("Nothing to commit or commit failed.")

    # 3. Git Push
    print("Pushing to GitHub...")
    if run_command("git push origin main --force"):
        print("\nSUCCESS! Deployment completed.")
    else:
        print("\nFAILED! Potential sync issue. Try pulling first or check your connection.")

if __name__ == "__main__":
    main()
