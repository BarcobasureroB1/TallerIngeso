import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Controller('cancha')
export class CanchaController {
  constructor(private readonly canchaService: CanchaService) {}

  @Post()
  create(@Body() createCanchaDto: CreateCanchaDto) {
    return this.canchaService.create(createCanchaDto);
  }

  @Get()
  findAll() {
    return this.canchaService.findAll();
  }

 
}
