export default class Feedback{
    constructor(readonly isPositive: boolean, readonly rating: number, readonly expectation: string, readonly details: string){
        //try to infer isPositive unless unprovided
        this.isPositive = isPositive === undefined? isPositive: !!isPositive;
        //NaN ratings will be caught at isValid
        this.rating = +rating;
        this.expectation = String(expectation);
        this.details = String(details);
    }

    readonly validExpectations = ['strongly disagree', 'disagree', 'neither agree nor disagree', 'agree', 'strongly agree'];

    toString() {
        return {"isPositive": this.isPositive, "rating": this.rating, "expectation": this.expectation, "details": this.details}
    }

    format() {
        //compile data object omitting empty fields
        const full: {[key: string]: any} = this.toString();
        let toAdd: {[key: string]: any} = {};
        Object.keys(full).forEach((key) => {
            if(full[key]) toAdd[key] = full[key];
        });
        return toAdd;
    }

    isValid() {
        return !!((this.isPositive !== undefined) && (!this.rating || this.rating > 0 && this.rating <= 5) && (!this.expectation || this.validExpectations.includes(this.expectation)));
    }
}