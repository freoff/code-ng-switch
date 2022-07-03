import * as vscode from "vscode";
import { existsSync } from "fs";
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("ng-switch.switch", () => {
    const path: string =
      vscode.window.activeTextEditor?.document.uri.fsPath || "";
    var pathArr: string[] = path.split("/");
    const isInsideNgFile: boolean =
      pathArr[pathArr.length - 1].includes(".component");
    if (!isInsideNgFile) {
      vscode.window.showWarningMessage(
        "You are probably 2 not inside an Angular component file"
      );
      return;
    }
    const stylesExt = ["scss", "sass", "css", "less",];
    const tsExt = ["ts"];
    const htmlExt = ["html"];
    const isTs = (ext: string) => tsExt.includes(ext);
    const isHtmlExt = (ext: string) => htmlExt.includes(ext);
    const isStyleExt = (ext: string) => stylesExt.includes(ext);

    const fileNameArr: string[] = pathArr[pathArr.length - 1].split(".");

    const currentFileExtension = fileNameArr[fileNameArr.length - 1];

    if (isTs(currentFileExtension)) {
      fileNameArr[fileNameArr.length - 1] = "html";
      pathArr[pathArr.length - 1] = fileNameArr.join(".");
    } else if (isHtmlExt(currentFileExtension)) {
      const foundedExtension = stylesExt.find((ext) => {
        const tempFileNameArr = [...fileNameArr];
        tempFileNameArr[tempFileNameArr.length - 1] = ext;
        const tempPathArr: string[] = [...pathArr];
        tempPathArr[tempPathArr.length - 1] = tempFileNameArr.join(".");
        return existsSync(tempPathArr.join("/"));
      });
      if (foundedExtension) {
        fileNameArr[fileNameArr.length - 1] = foundedExtension as string;
      } else {
        fileNameArr[fileNameArr.length - 1] = "ts";
      }
      pathArr[pathArr.length - 1] = fileNameArr.join(".");
    } else {
      fileNameArr[fileNameArr.length - 1] = "ts";
      pathArr[pathArr.length - 1] = fileNameArr.join(".");
    }

    var openFilePath: string = pathArr.join("/");
    vscode.window.activeTextEditor?.hide();
    var vsCodeOpenPath: vscode.Uri = vscode.Uri.file(openFilePath);
    vscode.workspace.openTextDocument(vsCodeOpenPath).then((doc) => {
      vscode.window.showTextDocument(doc);
    });
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}
