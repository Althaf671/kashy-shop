<script lang="ts">
	import { enhance } from "$app/forms";
	import Card from "$lib/components/ui/card/Card.svelte";
	import type { IUser } from "$lib/types/features";
	import type { PageData } from "../$types";

    let { data }: { data: PageData & { user: IUser | null } } = $props();
    let user = $derived(data.user) 
</script>

<main class="dashboard__container">
    <span>id: {user?.id}</span>
    <span>name: {user?.name}</span>
    <span>email: {user?.email}</span>

    <Card type="metric"/>
</main>

<form method="POST" action="/?/logout" use:enhance>
    <button type="submit">Sign out</button>
</form>

<form method="POST" action="/?/logoutAll" use:enhance>
    <button type="submit">Sign out from all devices</button>
</form>