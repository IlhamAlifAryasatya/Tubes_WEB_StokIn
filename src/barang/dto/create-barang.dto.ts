import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const DAFTAR_KATEGORI = ['Sembako', 'Minuman', 'Perawatan'];
export const DAFTAR_SATUAN = ['Karung', 'Botol', 'Sak', 'Rak', 'Sachet', 'Batang'];

export class CreateBarangDto {
  @Matches(/^BRG-\d{3}$/, { message: 'Kode barang harus berformat BRG-001' })
  kode: string;

  @IsString({ message: 'Nama barang harus berupa teks' })
  @MinLength(3, { message: 'Nama barang minimal 3 huruf' })
  nama: string;

  @IsIn(DAFTAR_KATEGORI, { message: 'Kategori harus Sembako, Minuman, atau Perawatan' })
  kategori: string;

  @IsIn(DAFTAR_SATUAN, { message: 'Satuan harus salah satu dari: ' + DAFTAR_SATUAN.join(', ') })
  satuan: string;

  @IsInt({ message: 'Stok harus bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh minus' })
  stok: number;

  @IsInt({ message: 'Harga harus bilangan bulat' })
  @Min(100, { message: 'Harga minimal Rp100' })
  harga: number;

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus true atau false' })
  aktif?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Catatan maksimal 200 karakter' })
  catatan?: string;
}
