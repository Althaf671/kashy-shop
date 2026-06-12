<script lang="ts">
  import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from "flowbite-svelte";

  function getCurrentYear(): number {
    return new Date(Date.now()).getFullYear()
  }
</script>

<Footer class="rounded-lg shadow-md">
  <FooterCopyright href="/" by="Kashy Handcraft" year={getCurrentYear()} />
  <FooterLinkGroup class="text-body mt-5 pt-2 flex gap-3 flex-wrap items-center text-sm sm:mt-0">
    <FooterLink href="/">About</FooterLink>
    <FooterLink href="/">Privacy Policy</FooterLink>
    <FooterLink href="/">Licensing</FooterLink>
    <FooterLink href="/">Contact</FooterLink>
  </FooterLinkGroup>
</Footer>