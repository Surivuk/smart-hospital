export default interface StringField {
    toString(): string;
    equals(field: StringField): boolean;
}