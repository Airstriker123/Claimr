import os
import sys

class ClientBanner(object):
    def __init__(self):
        self.banner_client = \
"""
 ▄▄· ▄▄▌  ▪  ▄▄▄ . ▐ ▄ ▄▄▄▄▄    .▄▄ · ▄▄▄ .▄▄▄   ▌ ▐·▄▄▄ .▄▄▄  
▐█ ▌▪██•  ██ ▀▄.▀·•█▌▐█•██      ▐█ ▀. ▀▄.▀·▀▄ █·▪█·█▌▀▄.▀·▀▄ █·
██ ▄▄██▪  ▐█·▐▀▀▪▄▐█▐▐▌ ▐█.▪    ▄▀▀▀█▄▐▀▀▪▄▐▀▀▄ ▐█▐█•▐▀▀▪▄▐▀▀▄ 
▐███▌▐█▌▐▌▐█▌▐█▄▄▌██▐█▌ ▐█▌·    ▐█▄▪▐█▐█▄▄▌▐█•█▌ ███ ▐█▄▄▌▐█•█▌
·▀▀▀ .▀▀▀ ▀▀▀ ▀▀▀ ▀▀ █▪ ▀▀▀      ▀▀▀▀  ▀▀▀ .▀  ▀. ▀   ▀▀▀ .▀  ▀
note: pwa feature: install only works on local host and not network
"""
        sys.stdout.write(ClientBanner.purplepink(self.banner_client))

    @staticmethod
    def purplepink(text):
        """
        method to print a banner gradient purple gradient in this case
        """
        faded = ""
        red = 40
        for line in text.splitlines():
            faded += (f"\033[38;2;{red};0;220m{line}\033[0m\n")
            if not red == 255:
                red += 15
                if red > 255:
                    red = 255
        return faded


def client_setup(choice):
    os.system(r'cls')
    print("Starting frontend client...")
    os.system('color b')

    # Check for npm dependencies
    if not os.path.exists("node_modules"):
        print("Installing client dependencies (this may take a minute)...")
        os.system("npm i")

    if choice == "1":
        print('Running client (development)...')
        os.system("npm run dev")

    elif choice == "2":
        print('Building and Previewing (production mode)...')
        os.system("npm run build && npm run preview")

    elif choice == "3":
        print('--- DEPLOYING TO GITHUB PAGES ---')
        # 1. Build the project
        os.system("npm run build")
        # 2. Add .nojekyll for GitHub Pages
        with open("build/.nojekyll", "w") as f: f.write("")
        # 3. Push to GitHub Pages branch
        # This requires: npm install -g gh-pages
        print("Pushing build folder to GitHub...")
        os.system("npx gh-pages -d build --add")
        print("\nSuccess! Check site at: http://claimr.dev/")

if __name__ == "__main__":
    try:
        os.system("color 6")
        print("Claimr DEPLOYMENT TOOL")
        print("---------------------------")
        print("[1] Run Development (Real-time editing)")
        print("[2] Run Production (Build and test locally)")
        print("[3] Run Deploy  (ghp)")

        user_choice = input("\nEnter option: ")
        client_setup(user_choice)
    except Exception as e:
        os.system("color c")
        print(f'Failed to setup: {e}')