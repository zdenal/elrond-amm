<script>
  import Notifications from 'svelte-notifications';
  import { page } from '$app/stores';

  import "../app.css";
  import Link from "../components/Link.svelte";

  $: path = $page.url.pathname;
</script>

<Notifications>
  <div class="min-h-full">
    <div class="bg-gray-800 pb-32">
      <nav class="bg-gray-800">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex items-center justify-between h-16 px-4 sm:px-0">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img class="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500" alt="Workflow">
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <Link href='/' text='Account' active={path == "/"} />
                    <Link href='swap' text='Swap' active={path == "/swap"} />
                    <Link href='provide' text='Provide' active={path == "/provide"} />
                    <Link href='faucet' text='Faucet' active={path == "/faucet"} />
                  </div>
                </div>
              </div>
              <div class="-mr-2 flex md:hidden">
                <!-- Mobile menu button -->
                <button type="button" class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                  <span class="sr-only">Open main menu</span>
                  <!--
                    Heroicon name: outline/bars-3

                    Menu open: "hidden", Menu closed: "block"
                  -->
                  <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <!--
                    Heroicon name: outline/x-mark

                    Menu open: "block", Menu closed: "hidden"
                  -->
                  <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="border-b border-gray-700 md:hidden" id="mobile-menu">
          <div class="px-2 py-3 space-y-1 sm:px-3">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a href="swap" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Swap</a>

            <a href="provide" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Provide</a>

            <a href="faucet" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Faucet</a>

            <a href="account" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Account</a>
          </div>
        </div>
      </nav>
      <header class="py-10">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl tracking-tight font-bold text-white">AMM</h1>
        </div>
      </header>
    </div>

    <main class="-mt-32">
      <div class="max-w-2xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div class="border-4 border-dashed border-gray-200 rounded-lg p-4"><slot /></div>
        </div>
      </div>
    </main>
  </div>
</Notifications>
