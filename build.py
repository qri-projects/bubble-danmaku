import os, shutil, sys, json

path = os.path.abspath(os.path.dirname(__name__))

packageJson = json.load(open(f"{path}/package.json", "r", encoding="utf8"))
version = packageJson["version"]

upperPath = f"{path}/build/bubble-danmaku"
dirName = f"bubble弹幕使-{version}"
targetPath = f"{upperPath}/{dirName}"
configFilePath = f"{targetPath}/config/config.json"

os.system("npm run build")
shutil.copytree(f"{path}/config", f"{path}/build/win-unpacked/config")
shutil.copy(f"{path}/LICENSE", f"{path}/build/win-unpacked/LICENSE")


if os.path.exists(upperPath):
    try:
        os.system(f"""rm -f "{upperPath}" """)
        shutil.rmtree(upperPath)
    except:
        pass

if not os.path.exists(upperPath):
    os.mkdir(upperPath)


os.rename(f"{path}/build/win-unpacked", targetPath)

with open(configFilePath, "r", encoding="utf8") as f:
    config = json.load(f)
    config["roomId"] = 336119
with open(configFilePath, "w", encoding="utf8") as f:
    json.dump(config, f,indent=4,separators=(', ',': '))

os.chdir(targetPath)
os.system(f"bubble弹幕使.exe")
