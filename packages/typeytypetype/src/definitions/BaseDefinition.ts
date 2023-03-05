import { deepFreeze } from '../internal/deepFreeze.js';
import { descend } from '../internal/descend.js';
import { stringForError } from '../internal/stringForError.js';
import { type Definition } from './Definition.js';
import {
    type Validator,
    type ValidationResult,
    type ValidationOptions,
    type ValidationSingleResult,
} from '../validation/types.js';
import { flattenValidatorResultsToStrings } from '../validation/flattenValidatorResultsToStrings.js';

export abstract class BaseDefinition<T> implements Definition<T> {
    readonly validators: Array<Validator<T>> = [];
    readonly labels: string[] = [];
    readonly attributes: Map<string, unknown> = new Map<string, unknown>();

    /**
     * Calls the callback on the current definition, then freezes the definition.
     * @param callback
     * @returns
     */
    setup(callback: (self: this) => void): this {
        callback(this);
        this.freeze();
        return this;
    }

    freeze(): this {
        deepFreeze(this);
        return this;
    }

    withLabel(label: string): this {
        this.labels.push(label);
        return this;
    }

    withLabels(...labels: string[]): this {
        this.labels.push(...labels);
        return this;
    }

    withAttr(name: string, value: unknown): this {
        this.attributes.set(name, value);
        return this;
    }

    withValidator(validator: Validator<T>): this {
        this.validators.push(validator);
        return this;
    }

    matches(value: unknown): value is T {
        return this.doMatches(value, true, 25);
    }

    abstract doMatches(
        value: unknown,
        deep: boolean,
        depth: number
    ): value is T;

    applyDefaultValidationOptions(
        options?: ValidationOptions
    ): ValidationOptions {
        return Object.assign({ deep: true }, options);
    }

    async validate(
        value: unknown,
        options?: ValidationOptions
    ): ValidationResult {
        return await this.doValidate(
            value,
            this.applyDefaultValidationOptions(options),
            25
        );
    }

    async validateAndThrow(
        value: unknown,
        options?: ValidationOptions
    ): Promise<T> {
        const res = await this.validate(value, options);
        if (res.length > 0) {
            throw new TypeError(
                `Value ${stringForError(
                    value
                )} did not pass validation: ${res.join(', ')}`
            );
        }
        return value as T;
    }

    async doValidate(
        value: unknown,
        options: ValidationOptions,
        depth: number
    ): ValidationResult {
        // Note that this is a type assertion
        // Passing deep: false as the assumption is that doMatches
        // will be called at each level of validation, which would multiply the cost of
        // doing validation.
        if (!this.doMatches(value, false, depth)) {
            return [{ message: 'Non-matching structure' }];
        }

        const errors: ValidationSingleResult[] = [];

        // Validate children first, as we need to
        // make sure structure is correct before validating the parent
        if (options.deep === true) {
            const validationResultsForDescendents =
                await this.doValidateChildren(value, options, descend(depth));
            if (validationResultsForDescendents !== undefined) {
                errors.push(...validationResultsForDescendents);
            }
        }

        for (const validator of this.validators) {
            const result = await validator(value);

            if (result !== null) {
                const flattened = await flattenValidatorResultsToStrings(
                    result
                );
                errors.push(...flattened.map((item) => ({ message: item })));
            }
        }

        return errors;
    }

    protected async doValidateChildren(
        value: T,
        options: ValidationOptions,
        depth: number
    ): Promise<ValidationSingleResult[] | undefined> {
        return undefined;
    }

    toTypeString(): string {
        return this.doToTypeString(25);
    }

    abstract doToTypeString(depth: number): string;

    hasLabel(label: string): boolean {
        return this.labels.includes(label);
    }

    getAttribute(name: string): unknown {
        return this.attributes.get(name);
    }
}
