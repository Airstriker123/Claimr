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

def clear():
    if os.name == 'nt':
        os.system('cls')
        return
    os.system('clear')

def replace_in_file(path, old, new):
    with open(path, "r") as f:
        lines = f.readlines()

    updated = []
    for line in lines:
        if old in line:
            updated.append(new + "\n")
        else:
            updated.append(line)

    with open(path, "w") as f:
        f.writelines(updated)


def client_setup(choice):
    os.system(r'cls')
    print("Starting frontend client...")
    os.system('color b')

    # Check for npm dependencies
    if not os.path.exists("node_modules"):
        print("Installing client dependencies (this may take a minute)...")
        os.system("npm i --no-fund")

    if choice == "1":
        print('Running client (development)...')
        os.system("npm run dev")
        return


    if choice == "2":
        print('Building and Previewing (production mode)...')
        os.system("npm run build && npm run preview")
        return
    else:
        input("invaid input")
        return
        
    
if __name__ == "__main__":
    try:
        clear()
        os.system("color 6")
        print\
("""Claimr DEPLOYMENT TOOL
---------------------------  
[1] Run Development (Real-time editing)  
[2] Run Production (Build and test locally with PWA features)  
""")
        user_choice = input("\nEnter option: ")
        client_setup(user_choice)
    except Exception as e:
        os.system("color c")
        print(f'Failed to setup: {e}')
