<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card
          shadow
          :color="infor.color"
          :icon="infor.icon"
          :icon-size="36"
          :key="timer1"
        >
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie
            style="height: 300px;"
            :value="pieData"
            text="发帖统计"
            tipName="统计内容"
            :key="timer2"
          ></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar
            style="height: 300px;"
            :value="barData"
            text="近六月累计发帖数量"
            :key="timer3"
          />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <week-stat :weekData="weekData" :key="timer4" style="height: 310px;" />
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import WeekStat from './weekstat'
import { getStatData } from '@/api/admin'
import moment from 'dayjs'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    WeekStat
  },
  data () {
    return {
      timer1: 0,
      timer2: 0,
      timer3: 0,
      timer4: 0,
      weekData: {},
      inforCardData: [
        {
          title: '新增用户',
          icon: 'md-person-add',
          count: 803,
          color: '#2d8cf0'
        },
        { title: '发帖累计', icon: 'md-locate', count: 232, color: '#19be6b' },
        {
          title: '新增评论',
          icon: 'md-chatbubbles',
          count: 142,
          color: '#ff9900'
        },
        {
          title: '本周采纳',
          icon: 'md-checkmark-circle',
          count: 657,
          color: '#ed3f14'
        },
        { title: '本周签到', icon: 'md-contacts', count: 12, color: '#E46CBB' },
        { title: '本周发帖', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 0, name: '提问' },
        { value: 0, name: '分享' },
        { value: 0, name: '讨论' },
        { value: 0, name: '建议' }
      ],
      barData: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      getStatData().then(res => {
        if (res.code === 200) {
          if (res.data.inforCardData) {
            this.inforCardData.forEach(
              (item, index) => (item.count = res.data.inforCardData[index])
            )
            this.timer1 = new Date().getTime()
          }
          if (res.data.pieData) {
            const arr = []
            const { pieData } = res.data
            arr.push({ name: '提问', value: pieData.ask || 0 })
            arr.push({ name: '分享', value: pieData.share || 0 })
            arr.push({ name: '讨论', value: pieData.discuss || 0 })
            arr.push({ name: '建议', value: pieData.advise || 0 })
            this.pieData = arr
            this.timer2 = new Date().getTime()
          }
          if (res.data.monthData) {
            const result = {}
            // 没有数据的月份补0 操作
            for (let i = 0; i <= 5; i++) {
              const key = moment().subtract(5 - i, 'M').format('YYYY-MM')
              result[key] = res.data.monthData[key] || 0
            }
            this.barData = result
            this.timer3 = new Date().getTime()
          }
          if (res.data.weekData) {
            this.weekData = res.data.weekData
            this.timer4 = new Date().getTime()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
