import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Between, Repository, In, DataSource } from 'typeorm'
import type { FindManyOptions } from 'typeorm'
import { CreateReminderDto } from './dto/create-reminder.dto'
import { UpdateReminderDto } from './dto/update-reminder.dto'
import { Reminder } from './entities/reminder.entity'
import { User } from '../users/entities/user.entity'
import { GetReminderDto } from './dto/get-reminder.dto'
import * as dayjs from 'dayjs'

interface NotificationItem {
  email: string
  content: string
  id: string
  sckey?: string
  cron?: string
  date?: number
}

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: Repository<Reminder>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(
    uid: number,
    createReminderDto: CreateReminderDto,
  ): Promise<Reminder> {
    const newReminder = this.remindersRepository.create({
      ...createReminderDto,
      uid,
    })

    return this.remindersRepository.save(newReminder)
  }

  async findAll(
    uid: number,
    getReminderDto: GetReminderDto,
  ): Promise<{ rows: Reminder[]; count: number }> {
    const startDate = getReminderDto.startDate
      ? dayjs(getReminderDto.startDate).valueOf()
      : null
    const endDate = getReminderDto.endDate
      ? dayjs(getReminderDto.endDate).endOf('day').valueOf()
      : null

    const where: Partial<Reminder> = {
      uid,
    }
    if (startDate && endDate) {
      where.date = Between(startDate, endDate) as unknown as number
    }
    const queryOptions: FindManyOptions = {
      where,
      order: { date: 'DESC' },
    }

    const { pageNo, pageSize, type, open } = getReminderDto

    if (type) {
      where.type = type
    }
    if (open != null) {
      where.open = open
    }
    if (pageNo != null && pageSize != null) {
      queryOptions.skip = pageNo * pageSize
      queryOptions.take = pageSize
    }

    const [rows, count] =
      await this.remindersRepository.findAndCount(queryOptions)

    return {
      rows,
      count,
    }
  }

  async findOne(id: string, uid: number): Promise<Reminder> {
    const reminder = await this.remindersRepository.findOne({
      where: { id, uid },
    })

    if (!reminder) {
      throw new NotFoundException('提醒事项不存在')
    }

    return reminder
  }

  async update(
    uid: number,
    updateReminderDto: UpdateReminderDto,
  ): Promise<Reminder> {
    const { id, ...updateData } = updateReminderDto
    await this.remindersRepository.update({ id, uid }, updateData)
    return this.findOne(id, uid)
  }

  async remove(id: string, uid: number): Promise<void> {
    const ids = id.split(',')
    const result = await this.remindersRepository.delete({ id: In(ids), uid })
    if (result.affected === 0) {
      throw new NotFoundException('提醒事项不存在')
    }
  }

  /**
   * 查找所有未发送的提醒
   * @returns 未发送的提醒列表
   */
  async findAllNotSend(): Promise<NotificationItem[]> {
    // 获取所有已到提醒时间且状态为"待提醒"(type=1)的提醒事项
    const reminders: NotificationItem[] = await this.dataSource.query(
      `SELECT
      r.content, r.id, r.cron, u.email, c.server_chan_sckey AS sckey
      FROM reminders AS r, users AS u, user_configures as c
      WHERE r.type = 1 AND r.open = 1 AND r.uid = u.uid AND c.uid = r.uid AND r.date <= ?`,
      [Date.now()],
    )

    return reminders
  }

  /**
   * 批量更新提醒状态
   * @param ids 提醒ID列表
   * @param type 更新的状态值
   */
  async updateByIds(
    ids: string[],
    updateReminderDto: Omit<UpdateReminderDto, 'id'>,
  ): Promise<void> {
    await this.remindersRepository.update(
      { id: In(ids) },
      { ...updateReminderDto },
    )
  }
}
