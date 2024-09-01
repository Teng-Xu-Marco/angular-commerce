import { FormControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";

export class ShopValidators {
    static notOnlyWhiteSpaces(formControl: FormControl): Observable<ValidationErrors | null> {

        if ((formControl.value != null) && (formControl.value.trim().length === 0)) {
            return of({'notOnlyWhiteSpaces': true});
        } else {
            return of(null);
        }
    }
}
