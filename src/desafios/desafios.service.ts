import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Model } from 'mongoose';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatus } from './enums/desafio-status.enum';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class DesafiosService {
  constructor(
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
  ) {}

  private readonly logger = new Logger('DesafiosService');

  async criarDesafio(criarDesafioDto: CriarDesafioDto) {
    const [jogadorId1, jogadorId2] = criarDesafioDto.jogadores;

    await this.jogadoresService.verificarSeJogadorFoiEncontrado(jogadorId1);
    await this.jogadoresService.verificarSeJogadorFoiEncontrado(jogadorId2);

    const solicitanteFazParteDoDesafio = criarDesafioDto.jogadores.find(
      (jogador) => jogador === criarDesafioDto.solicitante,
    );

    if (!solicitanteFazParteDoDesafio) {
      throw new BadRequestException(`Solicitante não faz parte do desafio.`);
    }

    const categoriaSolicitante =
      await this.categoriasService.consultarCategoriaDoJogador(
        criarDesafioDto.solicitante,
      );

    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.categoria = categoriaSolicitante.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    desafioCriado.dataHoraDesafio = criarDesafioDto.dataHoraDesafio;
    desafioCriado.status = DesafioStatus.PENDENTE;
    return await desafioCriado.save();
  }

  async atualizarDesafio(
    atualizarDesafioDto: AtualizarDesafioDto,
    idDesafio: string,
  ) {
    const desafio = await this.consultarDesafio(idDesafio);

    if (atualizarDesafioDto.dataHoraDesafio) {
      desafio.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;
    }

    if (atualizarDesafioDto.status) {
      desafio.dataHoraResposta = new Date();
      desafio.status = atualizarDesafioDto.status;
    }

    return await desafio.save();
  }

  async consultarDesafio(idDesafio: string) {
    const desafio = await this.desafioModel.findById(idDesafio).exec();

    if (!desafio) {
      throw new NotFoundException(
        `Desafio com id ${idDesafio} não encontrado.`,
      );
    }

    return desafio;
  }

  async consultarTodosDesafios() {
    const desafios = await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();

    return desafios;
  }

  async deletarDesafio(idDesafio: string) {
    const desafio = await this.consultarDesafio(idDesafio);

    desafio.status = DesafioStatus.CANCELADO;

    return await desafio.save();
  }

  async consultarDesafiosDeUmJogador(idJogador: string) {
    await this.jogadoresService.verificarSeJogadorFoiEncontrado(idJogador);

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in([idJogador])
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async atribuirDesafioPartida(
    idDesafio: string,
    atribuirResultadoPartida: AtribuirDesafioPartidaDto,
  ) {
    const desafio = await this.desafioModel
      .findById(idDesafio)
      .populate('jogadores')
      .exec();
    const jogadorVencedor = desafio.jogadores.find(
      (jogador) => jogador.id === atribuirResultadoPartida.def,
    );

    if (!jogadorVencedor) {
      throw new BadRequestException(
        'O jogador vencedor não faz parte do desafio!',
      );
    }

    const partidaCriada = new this.partidaModel(atribuirResultadoPartida);

    partidaCriada.categoria = desafio.categoria;
    partidaCriada.jogadores = desafio.jogadores;

    const partida = await partidaCriada.save();

    desafio.status = DesafioStatus.REALIZADO;
    desafio.partida = partida.id;

    try {
      desafio.save();
    } catch (_) {
      await partida.delete();
      throw new InternalServerErrorException();
    }

    return { partida, desafio };
  }
}
