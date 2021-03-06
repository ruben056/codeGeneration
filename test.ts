// import Project = require('﻿ts-simple-ast');
import Project, {Scope} from "ts-simple-ast";

//0. define classname and fields
const className = 'VerwantMetEerInwoner';
const fields = [
    {name:'verwantMetEerInwoner',type:'Veld<JaNeenType>'},
    {name:'eerVerwant',type:'EerInwoner'}
];

//1. create project + delete existinf file if it exsists allready
// (deleting doesn't always seem to work wel ...)
const projectToCleanup = new Project({compilerOptions: {outDir: "dist", declaration : true}});
projectToCleanup.addExistingSourceFiles("./*.ts");
const existinSrcFile = projectToCleanup.getSourceFile("src/"+className+".ts");
if(!!existinSrcFile){
  existinSrcFile.deleteImmediately();
}
projectToCleanup.save();

const project = new Project({compilerOptions: {outDir: "dist", declaration : true}});
project.addExistingSourceFiles("./*.ts");

//2. create class
const myClassFile = project.createSourceFile("src/"+className+".ts", "export class "+className+" {}");
const myClass = myClassFile.getClassOrThrow(className);
let constructorBodyText= '';
fields.forEach(field=>{
  myClass.addProperty({
      name: field.name,
      type: field.type
  });
  constructorBodyText += `this.${field.name} = ${field.name};\n`;
});
myClass.addConstructor({parameters:fields, bodyText:constructorBodyText});


//3. create builder
const builderName = myClass.getName()+'Builder';
myClassFile.addClass({name: builderName});
const myClassBuilder = myClassFile.getClassOrThrow(builderName);

myClassBuilder.addConstructor({scope: Scope.Private});

myClass.getProperties().forEach(prop => {
  myClassBuilder.addProperty({
      isReadonly: true,
      name: prop.getName(),
      type: prop.getType().getText()
      // ,initializer: "5" //TODO
  });
});
myClassBuilder.addMethod({
    isStatic: true,
    name: "builder",
    parameters: [{name: lowerCaseFirstLetter(className), type: className}],
    returnType : builderName,
    bodyText: `return new ${builderName}();`
});

myClass.getProperties().forEach(prop => {
  myClassBuilder.addMethod({
      name: "met"+upperCaseFirstLetter(prop.getName()),
      returnType : builderName,
      parameters: [{name: prop.getName(), type: prop.getType().getText()}],
      bodyText: 'this.'+prop.getName()+" = " + prop.getName()+";\nreturn this;"
  });
});

myClassBuilder.addMethod({
    name: "build",
    returnType : className,
    bodyText: `return new ${className}(${createFieldsForConstructorString(fields)});`
});
project.save();


const projectSpec = new Project({compilerOptions: {outDir: "dist", declaration : true}});
projectSpec.addExistingSourceFiles("./*.ts");
const mySpecFile = projectSpec.createSourceFile(
    "src/"+className+"spec.ts",
    schrijfSpecFileUit());
projectSpec.save();


function schrijfSpecFileUit(){
    let specFileContent = "describe('"+ className +"', () => {";
    specFileContent += "it('build van "+ className +"', () => {";
    specFileContent += "});";
    specFileContent += "it('gekopieerde  "+ className +", neemt alle velden over', () => {";
    specFileContent += "});";
    specFileContent += "});";
    return specFileContent;
}
function createFieldsForConstructorString(fields): string{
  let fieldsForConstructor = '';
  fields.forEach((field)=>{
    fieldsForConstructor += `${field.name}, `
  });
  return fieldsForConstructor.slice(0, -2);
}

function upperCaseFirstLetter(text: string) {
    return text[0].toUpperCase() + text.slice(1);
}

function lowerCaseFirstLetter(text: string) {
    return text[0].toLowerCase() + text.slice(1);
}