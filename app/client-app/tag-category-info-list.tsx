import style from './tag-category-info-list.module.css';

import { type CategorizedTagInfo } from "@/shared/type";


interface LinkInfoListProps {
  dataSource: CategorizedTagInfo[];
}

export default function CategorizedTagInfoList(
  { dataSource }: LinkInfoListProps
) {
  return (
    <div className={style.cardList}>
      {dataSource.map((record, idx) => {
        return (
          <div key={idx} className={style.card}>
            <div className={style.header}>
              <div className={style.cardIcon}>
                <img src={record.icon} />
              </div>
              <a
                href={record.url}
                target='_blank'
                title={record.title}
                className={style.cardName}
              >
                {record.title}
              </a>
            </div>
            <div className={style.tagList}>
              {record.tags.map(tagName => {
                return (
                  <div key={tagName} className={style.tagItem}>{tagName}</div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
