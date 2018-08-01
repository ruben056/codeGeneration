export class MyClass {
    myProp1: Number;
    myProp2: string;
    myProp3: Number;

    constructor(myProp1: Number, myProp2: string, myProp3: Number) {
        this.myProp1 = myProp1
        this.myProp2 = myProp2
        this.myProp3 = myProp3
    }
}

class MyClassBuilder {
    myProp1: Number;

    metmyProp1(myProp1: Number): MyClassBuilder {
        this.myProp1 = myProp1;
        return this;
    }

    myProp2: string;

    metmyProp2(myProp2: string): MyClassBuilder {
        this.myProp2 = myProp2;
        return this;
    }

    myProp3: Number;

    metmyProp3(myProp3: Number): MyClassBuilder {
        this.myProp3 = myProp3;
        return this;
    }

    static builder(MyClassBuilder: MyClassBuilder): MyClassBuilder {
        return new MyClassBuilder();
    }

    build(): MyClassBuilder {
        return new MyClass(myProp1:Number, myProp2:string, myProp3:Number);
    }
}
