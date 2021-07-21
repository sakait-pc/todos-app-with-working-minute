<template>
  <div class="display_info-wrap">
    <div class="display_info-item-wrap">
      <div class="display_info-item-label">ID</div>
      <div>{{ currentProject.id }}</div>
    </div>
    <div class="display_info-item-wrap">
      <div class="display_info-item-label">Start Date</div>
      <div>
        {{ currentProject.startDate }}
      </div>
    </div>
    <div class="display_info-item-wrap">
      <div class="display_info-item-label">Title</div>
      <div>{{ currentProject.title }}</div>
    </div>
    <div class="display_info-item-wrap">
      <div class="display_info-item-label">Last Update</div>
      <div>
        {{ currentProject.lastUpdate }}
      </div>
    </div>
    <div class="display_info-item-wrap">
      <div class="display_info-item-label">Working Minute</div>
      <div>
        {{ currentProject.workMinute
        }}<span class="display_info_wm-minute">min</span>
      </div>
      <div class="display_info_item-hour">
        {{ currentProject.workHour }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentProject: Object,
  },
};
</script>

<style scoped>
/* display - info */
.display-info {
  margin: 16px 0px;
}
.display_info-item-wrap {
  display: flex;
  margin-top: 8px;
}
.display_info-item-label {
  width: 120px;
}
.display_info_wm-minute {
  margin-left: 4px;
}
.display_info_item-hour {
  margin-left: 16px;
}
</style>
