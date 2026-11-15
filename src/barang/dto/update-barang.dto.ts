import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBarangDto } from './create-barang.dto.js';

// Semua field boleh diubah sebagian, kecuali kode (kode adalah pengenal barang).
export class UpdateBarangDto extends PartialType(OmitType(CreateBarangDto, ['kode'] as const)) {}
