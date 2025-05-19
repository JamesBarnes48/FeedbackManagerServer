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

    isValid() {
        return !!((this.isPositive !== undefined) && (this.rating > 0 && this.rating <= 5) && this.validExpectations.includes(this.expectation) && this.details.length);
    }
}