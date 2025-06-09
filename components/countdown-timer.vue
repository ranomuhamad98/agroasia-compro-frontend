<template>
  <client-only>
    <ul>
      <li>
        <span>{{ timer.days }}</span> Days
      </li>
      <li>
        <span>{{ timer.hours }}</span> Hours
      </li>
      <li>
        <span>{{ timer.minutes }}</span> Mins
      </li>
      <li>
        <span>{{ timer.seconds }}</span> Secs
      </li>
    </ul>
  </client-only>
</template>

<script setup lang="ts">
import { useTimer, type UseTimer } from "vue-timer-hook";

let timer: UseTimer;
const endTime = new Date("2024 Sep 30 20:20:22");
const endTimeMs = endTime.getTime();
timer = useTimer(endTimeMs);
</script>
