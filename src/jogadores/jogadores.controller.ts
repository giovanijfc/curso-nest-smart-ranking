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
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador-dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresServices: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    return await this.jogadoresServices.criarJogador(criarJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() criarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    await this.jogadoresServices.atualizarJogador(_id, criarJogadorDto);
  }

  @Get()
  async consultarJogadores() {
    return await this.jogadoresServices.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPeloId(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    return await this.jogadoresServices.consultarJogadorPeloId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.jogadoresServices.deletarJogador(_id);
  }
}
