import { Test, TestingModule } from '@nestjs/testing';
import { TotemController } from './totem.controller';

describe('TotemController', () => {
  let controller: TotemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotemController],
    }).compile();

    controller = module.get<TotemController>(TotemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
