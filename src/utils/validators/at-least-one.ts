import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function AtLeastOne(properties: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName: propertyName,
      constraints: properties,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return args.constraints
            .map(c => (args.object as any)[c])
            .some(c => c !== null && c !== undefined);
        },
      },
    });
  };
}