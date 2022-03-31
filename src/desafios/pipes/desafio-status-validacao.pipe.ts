import { BadRequestException, Logger, PipeTransform } from '@nestjs/common';
import { DesafioStatus } from '../enums/desafio-status.enum';

export class DesafioStatusValidacaoPipe implements PipeTransform {
  readonly statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} é um status inválido.`);
    }

    return {
      ...value,
      status,
    };
  }

  private ehStatusValido(status: any) {
    return this.statusPermitidos.includes(status);
  }
}
