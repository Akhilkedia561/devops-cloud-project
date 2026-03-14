import { exec } from "child_process";
export const runCommand = (command, cwd) => {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd });
        process.stdout?.on("data", (data) => {
            console.log(data);
        });
        process.stderr?.on("data", (data) => {
            console.error(data);
        });
        process.on("close", (code) => {
            if (code === 0)
                resolve(true);
            else
                reject(new Error(`Command failed: ${command}`));
        });
    });
};
//# sourceMappingURL=exec.js.map