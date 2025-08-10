// src/articles/article.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index
} from 'sequelize-typescript';
import { User } from '../entity/User';
import { slugify } from '../shared/slugify';

@Table({
  tableName: 'articles',
  paranoid: true,
  timestamps: true,
  hooks: {
    beforeCreate: (article: Article) => Article.generateSlugHook(article)
  },
  indexes: [
    {
      name: 'articles_title_content_fts',
      type: 'FULLTEXT',
      fields: ['title', 'content']
    },
    {
      name: 'articles_slug_idx',
      unique: true,
      fields: ['slug']
    }
  ]
})
export class Article extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  @Index('articles_title_idx')
  declare title: string;

  @Column({
    type: DataType.STRING,
    unique: true
  })
  declare slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean: true
    }
  })
  declare published: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE'
  })
  authorId: number;

  @BelongsTo(() => User)
  author: User;

  // createdAt dan updatedAt otomatis dibuat oleh Sequelize
  // deletedAt otomatis dibuat karena paranoid: true

  static generateSlugHook(article: Article) {
    if (!article.slug) {
      article.slug = slugify(article.title);
    }
  }
}