<template>
  <div id="app">
    <!-- ===== display ===== -->
    <main id="display">
      <div class="display_controller-wrap">
        <button @click="toPrev()" class="display-controller" v-show="showPrev">
          ↑
        </button>
      </div>

      <div class="display-indicator">
        <div>
          <span class="display_indicator-label">{{ current }}</span>
          <span class="display_indicator-label">/</span>
          <span class="display_indicator-label">{{ total }}</span>
        </div>
      </div>

      <div class="display-info">
        <div v-if="projects.length === 0">No Projects</div>
        <div v-else>
          <display-project :current-project="currentProject" />
        </div>
      </div>
      <div class="display_controller-wrap">
        <button @click="toNext()" class="display-controller" v-show="showNext">
          ↓
        </button>
      </div>
    </main>

    <!-- ===== editor ===== -->
    <aside id="editor">
      <div>
        <input class="editor-input" type="date" v-model="startDate" />
      </div>
      <div class="editor_create_title-wrap">
        <input
          class="editor-input"
          type="text"
          name="title"
          v-model="title"
          placeholder="Title"
        />
      </div>
      <div class="editor_btn-wrap">
        <button @click="createProject()">Create</button>
      </div>

      <div class="editor_update-wrap">
        <input
          class="editor-input"
          type="text"
          v-model="workingMinuteUpdate"
          placeholder="Working Minute + -"
        />
      </div>
      <div class="editor_btn-wrap">
        <button @click="updateWorkMinute()" :disabled="projects.length === 0">
          Update
        </button>
      </div>

      <div class="editor_delete_btn-wrap">
        <button @click="deleteProject()" :disabled="projects.length === 0">
          Delete
        </button>
      </div>
    </aside>
  </div>
</template>

<script>
import {
  createProjectAsync,
  fetchAllProjectsAsync,
  updateProjectAsync,
  deleteProjectAsync,
} from './api';

import {getLastUpdate} from './lib';

import DisplayProject from './components/DisplayProject.vue';

export default {
  components: {
    DisplayProject,
  },
  data() {
    return {
      projects: [],
      currentProject: {},
      startDate: '',
      title: '',
      workingMinuteUpdate: '',
    };
  },
  created() {
    this.setStartDate();
    this.fetchAllProjects();
  },
  computed: {
    total() {
      return this.projects.length;
    },
    current() {
      return (
        this.projects.findIndex(
          project => project.id === this.currentProject.id,
        ) + 1
      );
    },
    showPrev() {
      if (this.projects.length <= 1) return false;
      const currentIdx = this.projects.findIndex(
        project => project.id === this.currentProject.id,
      );
      return currentIdx === 0 ? false : true;
    },
    showNext() {
      if (this.projects.length <= 1) return false;
      const currentIdx = this.projects.findIndex(
        project => project.id === this.currentProject.id,
      );
      return currentIdx === this.projects.length - 1 ? false : true;
    },
  },
  methods: {
    setStartDate() {
      this.startDate = getLastUpdate().slice(0, 10);
    },
    toPrev() {
      const currentIdx = this.projects.findIndex(
        project => project.id === this.currentProject.id,
      );
      if (currentIdx === 0) return;
      if (currentIdx <= -1) {
        alert('ERROR: The target project does not exist in the projects!');
        return;
      } else {
        // The project whose index is the previous one is the currentProject
        this.currentProject = this.projects.slice(
          currentIdx - 1,
          currentIdx,
        )[0];
      }
    },
    toNext() {
      const currentIdx = this.projects.findIndex(
        project => project.id === this.currentProject.id,
      );
      if (currentIdx === this.projects.length - 1) return;
      if (currentIdx <= -1) {
        alert('ERROR: The target project does not exist in the projects!');
        return;
      } else {
        // The project whose index is the next one is the currentProject
        this.currentProject = this.projects.slice(
          currentIdx + 1,
          currentIdx + 2,
        )[0];
      }
    },
    async deleteProject() {
      const message = `Are you sure you want to delete this project?
      id: ${this.currentProject.id}
      Start Date: ${this.currentProject.startDate}
      Title: ${this.currentProject.title}
      `;
      if (confirm(message)) {
        const status = await deleteProjectAsync(this.currentProject.id);
        if (status === 200) {
          const projects = this.projects.filter(project => {
            return project.id !== this.currentProject.id;
          });
          this.projects = projects;
          this.currentProject = projects.slice(-1)[0];
        } else {
          alert('Failed to delete this project.');
        }
      }
    },
    validateDiff() {
      const isInt = parseInt(this.workingMinuteUpdate);
      // Monolithic means that the target does not have spaces
      const isMonolithicHalf = this.workingMinuteUpdate.split(' ').length < 2;
      const isMonolithicFull = this.workingMinuteUpdate.split('　').length < 2;
      if (isInt && isMonolithicHalf && isMonolithicFull) {
        if (isInt < 0 && this.currentProject.workMinute === 0) return;
        return this.workingMinuteUpdate;
      } else {
        return;
      }
    },
    async updateWorkMinute() {
      const diff = this.validateDiff();
      if (!diff) {
        alert('Invalid value.');
        return;
      }

      const updatedProject = await updateProjectAsync({
        diff,
        current: this.currentProject,
      });

      this.currentProject = updatedProject;
      this.projects = this.projects.map(project => {
        if (project.id === updatedProject.id) return updatedProject;
        return project;
      });

      this.workingMinuteUpdate = '';
    },
    async createProject() {
      if (!this.startDate || !this.title) {
        alert('Select start date and input title.');
        return;
      }
      const id =
        this.projects.length === 0 ? 1 : this.projects.slice(-1)[0].id + 1;
      const data = await createProjectAsync(id, this.startDate, this.title);
      this.projects.push(data);
      this.currentProject = data;
      this.setStartDate();
      this.title = '';
    },
    async fetchAllProjects() {
      const projects = await fetchAllProjectsAsync();
      this.projects = projects;
      this.currentProject = projects.slice(-1)[0];
    },
  },
};
</script>

<style>
/* variable */
:root {
  --input-width: 168px;
  --input-width-sp: 296px;
}

/* reset */
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}
body {
  margin: 0px;
}
input {
  height: 24px;
  padding-left: 4px;
}
button {
  height: 24px;
  padding: 0px 8px;
}

/* layout */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 24px 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
#editor {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 24px;
}
#display {
  width: 320px;
  padding: 8px 24px 8px 0px;
  border-right: 1px solid #000;
}

/* display - controller */
.display_controller-wrap {
  display: flex;
  justify-content: center;
  height: 24px;
}
.display-controller {
  width: 48px;
}
/* display - indicator */
.display-indicator {
  display: flex;
  justify-content: flex-end;
  height: 16px;
  margin-top: 8px;
}
.display_indicator-label {
  font-size: 14px;
}

/* editor */
.editor-input {
  width: var(--input-width);
}
.editor_create_title-wrap {
  margin-top: 8px;
}
.editor_btn-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
.editor_update-wrap {
  display: flex;
  margin-top: 24px;
}
.editor_delete_btn-wrap {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
}

@media screen and (max-width: 560px) {
  #app {
    flex-direction: column;
    align-items: center;
    justify-content: normal;
  }
  #display {
    padding: 8px;
    border: none;
  }
  #editor {
    padding: 8px;
  }
  .editor-input {
    width: var(--input-width-sp);
  }
}
</style>
