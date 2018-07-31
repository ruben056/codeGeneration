export class MyClass {
    myProp1: Number;
    myProp2: string;
    myProp3: Number;
}

class MyClassBuilder {
    myProp1: Number;
    myProp2: string;
    myProp3: Number;

    metmyProp1(myProp1: Number): MyClassBuilder {
        this.myProp1 = myProp1;
        return this;
    }

    metmyProp2(myProp2: string): MyClassBuilder {
        this.myProp2 = myProp2;
        return this;
    }

    metmyProp3(myProp3: Number): MyClassBuilder {
        this.myProp3 = myProp3;
        return this;
    }
}
