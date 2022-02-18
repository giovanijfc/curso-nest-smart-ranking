import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresServices: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    await this.jogadoresServices.criarAtualizarJogador(criarJogadorDto);
  }

  @Get()
  async consultarJogadores(@Query('email') email: string) {
    if (email) {
      return await this.jogadoresServices.consultaJogadoresPeloEmail(email);
    } else {
      return await this.jogadoresServices.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogador(@Query('email') email: string) {
    this.jogadoresServices.deletarJogador(email);
  }
}
