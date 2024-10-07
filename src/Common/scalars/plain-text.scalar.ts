// src/common/scalars/PlainTextScalar.ts
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('PlainText', () => String)
export class PlainTextScalar implements CustomScalar<string, string> {
  description = 'PlainText custom scalar type for multi-line strings';

  parseValue(value: string): string {
    return value; // value from the client input
  }

  serialize(value: string): string {
    return value; // value sent to the client
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return ast.value; // ast value is always in string format
    }
    return null;
  }
}
