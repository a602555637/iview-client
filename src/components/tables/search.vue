<template>
  <div class="wrapper">
    <template v-if="item.type === 'radio'">
      <RadioGroup @on-change="handleChange" :value="inputValue">
        <Radio
          v-for="(obj, index) in finalRadio"
          :key="'search-radio-' + index"
          :label="obj.value"
        >
          <span>{{ obj.key }}</span>
        </Radio>
      </RadioGroup>
    </template>
    <template v-else-if="item.type === 'date'">
      <DatePicker
        @on-change="handleChange"
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间段"
        style="width: 200px"
      ></DatePicker>
    </template>
    <template v-else-if="item.type === 'select'">
      <Select v-model="selection" style="width:200px" @on-change="handleChange" :value="inputValue">
        <Option
          v-for="obj in item.options"
          :value="obj.value"
          :key="obj.value"
          >{{ obj.key }}</Option
        >
      </Select>
    </template>
    <template v-else>
      <Input
        @on-change="handleChange"
        :value="inputValue"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [String, Array, Number],
      default: ''
    }
  },
  data () {
    return {
      selection: [],
      radioOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '否',
          value: '0'
        },
        {
          key: '是',
          value: '1'
        }
      ]
    }
  },
  computed: {
    finalRadio () {
      let result = {}
      if (this.item.type === 'radio') {
        result = this.item.options || this.radioOptions
      }
      return result
    },
    inputValue () {
      return this.value
    }
  },
  methods: {
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    handleChange (vaule) {
      this.$emit('changeEvent', value)
    }
  }
}
</script>

<style lang="scss" scoped>

.wrapper {
  display: inline-block;
  margin: 0 10px;
}

</style>
