import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../common/shop-validators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  monthsList: number[] = [];
  yearsList: number[] = [];
  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private shopFormService: ShopFormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formbuilder.group({
      customer: this.formbuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2)], ShopValidators.notOnlyWhiteSpaces],
        lastName: ['', [Validators.required, Validators.minLength(2)], ShopValidators.notOnlyWhiteSpaces],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            ),
          ],
        ],
      }),
      shippingAddress: this.formbuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
      billingAddress: this.formbuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
      creditCard: this.formbuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const curMonth = new Date().getMonth() + 1;
    this.shopFormService
      .getCreditCardMonths(curMonth)
      .subscribe((data) => (this.monthsList = data));
    this.shopFormService
      .getCreditCardYears()
      .subscribe((data) => (this.yearsList = data));

    this.shopFormService.getCountries().subscribe((data) => {
      this.countries = data;
      // console.log(this.countries);
    });
  }

  // getter and setter
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName')!;
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName')!;
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email')!;
  }

  copyShippingToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingStates = this.shippingStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }

  setMonthsRange(theSelectedYear: string) {
    const curYear = new Date().getFullYear();
    let startMonth = new Date().getMonth() + 1;

    if (curYear != +theSelectedYear) {
      startMonth = 1;
    } else {
      startMonth = new Date().getMonth() + 1;
    }

    this.shopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.monthsList = data));
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const curCountryCode = formGroup?.value.country.code;

    // console.log(curCountryCode);

    this.shopFormService
      .getStatesByCountryCode(curCountryCode)
      .subscribe((data) => {
        if (formGroupName == 'shippingAddress') {
          this.shippingStates = data;
        } else {
          this.billingStates = data;
        }
      });
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')!.value);

    if (this.checkoutFormGroup.invalid) {
      // mark all the required or invalid form control
      this.checkoutFormGroup.markAllAsTouched();
    }
  }
}
