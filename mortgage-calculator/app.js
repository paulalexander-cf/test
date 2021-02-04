Vue.component('calculator-slider', {
    props: {
        slider: { type: Object, required: true },
    },
    computed: {
        sliderStyle() {
            let sliderValue = (this.slider.value-this.slider.min)/(this.slider.max-this.slider.min)*100;
            return 'linear-gradient(to right, #00b2a4 0%, #00b2a4 ' + sliderValue + '%, #eaebef ' + sliderValue + '%, #eaebef 100%)';
        }
    },
    template: `
        <div class="slideContainer">
            <div class="sliderLabel">
                <label>{{ slider.label }}</label>
                <slot :slider="slider"></slot>
            </div>
            <input v-model="slider.value" type="range" :min="slider.min" :max="slider.max" :step="slider.step" class="slider" :style="{background: sliderStyle}">
        </div>
    `
});

new Vue({
    el: '#mortgageCalculator',
    data() {
        return {
            propertyValue: 0,
            loanLength: 0,
            downPayment: 0,
            interestRate: 0,
            sliders: [
                { label: 'Property Value', min: 80000, max: 1000000, step: 5000, value: 550000, },
                { label: 'Length of Loan', min: 10, max: 30, step: 5, value: 10, },
                { label: 'Down Payment', min: 1, max: 100, step: 1, value: 14, },
                { label: 'Interest Rate', min: 0.5, max: 8.5, step: 0.5, value: 3.5, },
            ],
        }   
    },
    methods: {
        getSliderFormat: function(slider) {
            let valueFormat = '';
            switch (slider.label) {
                case 'Property Value':
                    this.propertyValue = slider.value;
                    valueFormat = this.formattedPropertyValue;
                    break;
                case 'Length of Loan':
                    this.loanLength = slider.value;
                    valueFormat = this.formattedLoanLength;
                    break;
                case 'Down Payment':
                    this.downPayment = slider.value;
                    valueFormat = this.calculatedDownPayment;
                    break;
                case 'Interest Rate':
                    this.interestRate = slider.value;
                    valueFormat = this.formattedInterestRate;
                    break;
                default:
                    valueFormat = '';
                    break;
            }
            return valueFormat;
        }
    },
    computed: {
        calculatedPayment() {
            principal = this.propertyValue - (this.downPayment/100 * this.propertyValue);
            monthlyInterestRate = (this.interestRate/12)/100;
            termInMonths = this.loanLength * 12;
            return new Intl.NumberFormat().format(Math.round((principal * monthlyInterestRate * (Math.pow(1 + monthlyInterestRate, termInMonths)) / (Math.pow(1 + monthlyInterestRate, termInMonths) - 1)), 2));
        },

        formattedPropertyValue() {
            return '$' + new Intl.NumberFormat().format(this.propertyValue);
        },

        formattedLoanLength() {
            return this.loanLength + ' years';
        },

        calculatedDownPayment() {
            return this.downPayment + '% / $' + new Intl.NumberFormat().format(this.downPayment/100 * (this.propertyValue));
        },

        formattedInterestRate() {
            return this.interestRate + '%';
        }
    }
});