import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador-dto';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto) {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
    }

    this.logger.log('29 criarJogador');

    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  async atualizarJogador(_id: string, criarJogadorDto: AtualizarJogadorDto) {
    const jogadorEncontrado = await this.verificarSeJogadorFoiEncontrado(_id);

    if (jogadorEncontrado) {
      await this.jogadorModel
        .findOneAndUpdate({ _id }, { $set: criarJogadorDto })
        .exec();
    }
  }

  async consultarTodosJogadores() {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string) {
    const jogadorEncontrado = await this.verificarSeJogadorFoiEncontrado(_id);

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string) {
    const jogadorEncontrado = await this.verificarSeJogadorFoiEncontrado(_id);

    if (jogadorEncontrado) {
      return await this.jogadorModel.deleteOne({ _id }).exec();
    }
  }

  private async verificarSeJogadorFoiEncontrado(_id: string) {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    return jogadorEncontrado;
  }
}
