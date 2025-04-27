import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import * as speakeasy from "speakeasy";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  twoFactorEnabled!: boolean;

  @Column({ nullable: true })
  twoFactorSecret!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async verify2FACode(code: string): Promise<boolean> {
    if (!this.twoFactorSecret) {
      return false;
    }

    try {
      return speakeasy.totp.verify({
        secret: this.twoFactorSecret,
        encoding: "base32",
        token: code,
        window: 1,
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du code 2FA:", error);
      return false;
    }
  }

  generate2FASecret(): string {
    return speakeasy.generateSecret({
      name: `DIP-easy:${this.email}`,
      length: 32,
    }).base32;
  }
}
