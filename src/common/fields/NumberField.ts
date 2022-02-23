export default interface NumberField {
    value(): number;
    equals(field: NumberField): boolean;
}