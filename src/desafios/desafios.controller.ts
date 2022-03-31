import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validacao.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Put('/:idDesafio')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('idDesafio') idDesafio: string,
  ) {
    return await this.desafiosService.atualizarDesafio(
      atualizarDesafioDto,
      idDesafio,
    );
  }

  @Delete('/:idDesafio')
  async deletarDesafio(@Param('idDesafio') idDesafio: string) {
    return await this.desafiosService.deletarDesafio(idDesafio);
  }

  @Get()
  async consultarTodosDesafios() {
    return await this.desafiosService.consultarTodosDesafios();
  }

  @Get('/:idDesafio')
  async consultarDesafio(@Param('idDesafio') idDesafio: string) {
    return await this.desafiosService.consultarDesafio(idDesafio);
  }

  @Get('/jogador/:idJogador')
  async consultarDesafiosDeUmJogador(@Param('idJogador') idJogador: string) {
    return await this.desafiosService.consultarDesafiosDeUmJogador(idJogador);
  }

  @Post('/:idDesafio/partida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida(
    @Param('idDesafio') idDesafio: string,
    @Body() atribuirResultadoPartida: AtribuirDesafioPartidaDto,
  ) {
    return await this.desafiosService.atribuirDesafioPartida(
      idDesafio,
      atribuirResultadoPartida,
    );
  }
}
