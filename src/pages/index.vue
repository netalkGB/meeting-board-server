<template>
  <div class="main">
    <h1 class="title">
      直近のミーティング
    </h1>
    <div class="listarea">
      <div v-for="(meeting, date) in meetingList" :key="date" class="meetingDay">
        <div class="meetingDate">
          {{ date }}
        </div>
        <div class="meetingTimeArea">
          <div v-for="item in meeting" :key="item.id" class="meetingTime">
            <div class="meetingTitle">
              {{ item.name }}
            </div>
            {{ item.startTime }}&nbsp;&nbsp;〜&nbsp;&nbsp;{{ item.endTime }}
          </div>
        </div>
      </div>
    </div>
    <div class="upddate">
      最終更新: {{ updateDate }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import toDoubleDigits from '@/utils/toDoubleDigits'

export default Vue.extend({
  async asyncData ({ $axios }) {
    const startDate = new Date()
    const startYear = startDate.getFullYear()
    const startMonth = toDoubleDigits(startDate.getMonth() + 1)
    const startDay = toDoubleDigits(startDate.getDate())
    const endDate = new Date(startDate.setDate(startDate.getDate() + 6))
    const endYear = endDate.getFullYear()
    const endMonth = toDoubleDigits(endDate.getMonth() + 1)
    const endDay = toDoubleDigits(endDate.getDate())

    const url = 'http://localhost:3000/api/calendar'
    const response = await $axios.$get(url, {
      params: {
        timeMin: `${startYear}-${startMonth}-${startDay}T00:00:00+09:00`,
        timeMax: `${endYear}-${endMonth}-${endDay}T23:59:59+09:00`
      }
    })
    return {
      data: response
    }
  },
  computed: {
    meetingList () {
      const nowDateEpoch = new Date().getTime()

      // 終わったミーティングを除外し、昇順にソートする
      const data = this.data.filter(item => new Date(item.end.dateTime).getTime() > nowDateEpoch).sort(
        (a, b) =>
          new Date(a.start.dateTime).getTime() -
          new Date(b.start.dateTime).getTime()
      )

      // yyyy/mm/dd(曜日)なSet
      const dateSet = new Set()
      for (const item of data) {
        const startDateTime = new Date(item.start.dateTime)
        const startYear = startDateTime.getFullYear()
        const startMonth = startDateTime.getMonth() + 1
        const startDay = startDateTime.getDate()
        const startWeekNum = startDateTime.getDay()
        const date = `${startYear}/${startMonth}/${startDay}/${startWeekNum}`
        dateSet.add(date)
      }

      const meetingList = {}
      const weekStringList = ['日', '月', '火', '水', '木', '金', '土']
      for (const meetingDay of dateSet) {
        const splitedBySlashMeetingDay = meetingDay.split('/')
        const year = parseInt(splitedBySlashMeetingDay[0], 10)
        const month = parseInt(splitedBySlashMeetingDay[1], 10)
        const day = parseInt(splitedBySlashMeetingDay[2], 10)
        const week = parseInt(splitedBySlashMeetingDay[3], 10)
        const weekString = weekStringList[week]
        const meetingListKey = `${year}年${toDoubleDigits(month)}月${toDoubleDigits(day)}日 (${weekString})`
        meetingList[meetingListKey] = data.filter((item) => {
          const itemStartDateTime = new Date(item.start.dateTime)
          const itemStartYear = itemStartDateTime.getFullYear()
          const itemStartMonth = itemStartDateTime.getMonth() + 1
          const itemStartDay = itemStartDateTime.getDate()
          return (year === itemStartYear && month === itemStartMonth) && day === itemStartDay
        }).map((item) => {
          const startDate = new Date(item.start.dateTime)
          const endDate = new Date(item.end.dateTime)
          const startTime = `${toDoubleDigits(
            startDate.getHours()
          )}:${toDoubleDigits(startDate.getMinutes())}`
          const endTime = `${toDoubleDigits(
            endDate.getHours()
          )}:${toDoubleDigits(endDate.getMinutes())}`
          return {
            id: item.id,
            name: item.name,
            startTime,
            endTime
          }
        })
      }
      return meetingList
    },
    updateDate () {
      const nowDate = new Date()
      return `${nowDate.getFullYear()}/${toDoubleDigits(
        nowDate.getMonth() + 1
      )}/${toDoubleDigits(nowDate.getDate())} ${toDoubleDigits(
        nowDate.getHours()
      )}:${toDoubleDigits(nowDate.getMinutes())}`
    }
  }
})
</script>

<style scoped>
.main {
  padding: 8px;
  font-size: 35px;
}
.title {
  font-size: 35px;
  padding: 0px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.listarea {
  height: 465px;
  overflow: hidden;
  margin: 0px;
}
.upddate {
  font-size: 28px;
  position: absolute;
  top: 0px;
  right: 3px;
  color: #777777;
}
.meetingDay {
  display: flex;
}
.meetingTime {
  margin-left: 50px;
  display: flex;
}
.meetingTitle {
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
