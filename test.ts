// import Project = require('﻿ts-simple-ast');
import Project from ﻿"ts-simple-ast";

const className = 'MyClass';
const fields = [
  {name:'myProp1',type:'Number'},
  {name:'myProp2',type:'string'},
  {name:'myProp3',type:'Number'}
]


const project = new Project();
project.addExistingSourceFiles("./*.ts");

const existinSrcFile = project.getSourceFile("src/"+className+".ts");
if(!!existinSrcFile){
  existinSrcFile.deleteImmediately();
}
const myClassFile = project.createSourceFile("src/"+className+".ts", "export class "+className+" {}");

// get information from ast
const myClass = myClassFile.getClassOrThrow(className);
myClass.getName();          // returns: "MyClass"
myClass.hasExportKeyword(); // returns: true
myClass.isDefaultExport();  // returns: false

fields.forEach(field=>{
  myClass.addProperty({
      name: field.name,
      type: field.type
  });
});

const builderName = myClass.getName()+'Builder';
myClassFile.addClass({name: builderName});
const myClassBuilder = myClassFile.getClassOrThrow(builderName);

myClass.getProperties().forEach(prop => {
  myClassBuilder.addProperty({
      name: prop.getName()
      ,type: prop.getType().getText()
      // ,initializer: "5" //TODO
  });
});

myClassBuilder.getProperties().forEach(prop => {
  myClassBuilder.addMethod({
      name: "met"+prop.getName(),
      returnType : builderName,
      parameters: [{name: prop.getName(), type: prop.getType().getText()}],
      bodyText: 'this.'+prop.getName()+" = " + prop.getName()+";\nreturn this;"
  });
});


project.save();
