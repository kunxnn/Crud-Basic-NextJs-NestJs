import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);  // แฮชรหัสผ่านก่อนบันทึก
      createUserDto.password = hashedPassword;

      const newUser = this.UserRepository.create(createUserDto);  // สร้างและบันทึกผู้ใช้
      const user = await this.UserRepository.save(newUser);

      const { password: _, ...userWithoutPassword } = user; // ลบ password ออกจาก response

      return {
        code: 201,
        message: 'insert successful',
        data: userWithoutPassword,
      };
    } catch (error) {
      return {
        code: 400,
        message: 'insert failed',
        error: error.message,
      };
    }
  }

  // findAll() {
  //   return this.UserRepository.find();
  // }

  async findAll(pagination: PaginationQueryDto) {
    const { limit = 10, page = 1 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.UserRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.UserRepository.findOneBy({ user_id: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateUserDto.password = hashedPassword;
    }

    const user = await this.UserRepository.findOne({ where: { user_id: id } });


    if (!user) { // ถ้าผู้ใช้ไม่พบ
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.UserRepository.save(user);
    return {
      code: 201,
      message: 'Update successful',
      data: updatedUser,
    };
  }

  async remove(id: number) {
    const result = await this.UserRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return {
        code: 200,
        message: 'ลบสำเร็จ !!',
      }
    } else {
      return {
        code: 404,
        message: 'ไม่พบผู้ใช้งานที่ต้องการลบ',
      };
    }
  }


  async findByUsername(username: string): Promise<User | null> {
    return this.UserRepository.findOne({ where: { username } });
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);  // แฮชรหัสผ่านก่อนบันทึก
      createUserDto.password = hashedPassword;

      const newUser = this.UserRepository.create(createUserDto);  // สร้างและบันทึกผู้ใช้
      const user = await this.UserRepository.save(newUser);

      const { password: _, ...userWithoutPassword } = user; // ลบ password ออกจาก response

      return {
        code: 201,
        message: 'Register successful',
        data: userWithoutPassword,
      };
    } catch (error) {
      return {
        code: 400,
        message: 'Register failed',
        error: error.message,
      };
    }
  }

}
