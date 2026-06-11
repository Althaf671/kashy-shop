<script lang="ts">
    import type { TCardProps } from "$lib/types/global/ui.types";
	  import { SmileIcon } from "@hugeicons/core-free-icons";
    import { HugeiconsIcon } from '@hugeicons/svelte'

    let { content }: { content: TCardProps } = $props<{ content: TCardProps }>()
</script>

{#if content.type === "metric"}
    <div class="card w-96 bg-base-100 card-sm shadow-sm">
        <div class="card-body">
            <!-- upper -->
            <div class="upper">
              <!-- right -->
              <div class="right">
                  <h2 class="card-title">{content.item.name}</h2>
                  <span>{content.item.value}</span>
              </div>
              </div>

              <!-- Absolute menu -->
              <HugeiconsIcon
                  icon={content.item.icon}
                  size={28}
                  color="#6b7280"
                  strokeWidth={1.35}
                  style="position: absolute; right: 12px; cursor: pointer;"
              />
          </div>

        <!-- lower -->
        <div class="lower">
            <p class="desc">
              {#if content.item.progress.trend === "up"}
                  <span>
                    {content.item.progress.value} 
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="green" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                      class="arrow-positive"
                    >
                      <path d="M12 2L2 12H22L12 2Z" fill="green" />
                    </svg>
                    from yesterday
                  </span>
              {:else if content.item.progress.trend === "down"}
                  <span>
                      {content.item.progress.value} 
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="red" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        class="arrow-negative"
                      >
                        <path d="M12 22L22 12H2L12 22Z" fill="red" />
                      </svg>
                      from yesterday
                  </span>
              {:else}
                  <span class="neutral">
                    <HugeiconsIcon
                      icon={SmileIcon}
                      size={18}
                      color="#000000"
                      strokeWidth={1.5}
                      class="icon-wrapper"
                    />
                    nothings new
                  </span>
              {/if}
            </p>
        </div>
    </div>
{:else if content.type === "action"}
    <div class="action-card">Action Card</div>
{:else if content.type === "notification"}
    <div class="notification-card">Notification Card</div>
{/if}

<style>
  .card {
    position: relative;
  }
  
  .card-body {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    height: 95px;
  }

  .upper {
    display: flex;
    gap: 0.75rem;
    height: 50px;
  }

  .upper .right {
    display: flex;
    flex-direction: column;
  }

  .upper .right .card-title {
    font-weight: 400;
    font-size: 0.89rem;
    color: #6b7280;
  }

  .upper .right span {
    font-size: 1.8rem;
    font-weight: 500;
    margin-top: 8px;
  }

  .lower {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-top: 0.5px solid rgba(128, 128, 128, 0.3);
    padding: 0.35rem 0.95rem;
    background-color: rgba(0, 0, 0, 0.007);
  }

  .lower .desc span {
    display: flex;
    gap: 0.35rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .arrow-negative {
    width: 12px;
    padding-bottom: 4px;
    margin-right: 4px;
    color: red;
  }

  .arrow-positive {
    width: 12px;
    padding-top: 4px;
    margin-right: 4px;
    color: green;
  }

  .neutral {
    display: flex;
  }
</style>