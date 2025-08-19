<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8" sm="10">
        <v-card class="pa-6" flat rounded="xl">
          <v-card-title class="text-h4 font-weight-bold text-center mb-4">About Us</v-card-title>
          <v-card-subtitle class="text-center mb-6">Impressum & Contact</v-card-subtitle>

          <v-sheet class="pa-4 mb-6" rounded="lg">
            <v-card-title class="text-h6 font-weight-bold mb-4">Our Mission</v-card-title>
            <v-card-text class="text-body-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </v-card-text>
          </v-sheet>

          <v-sheet class="pa-4 mb-6" rounded="lg">
            <v-card-title class="text-h6 font-weight-bold mb-4">Contact Information</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-map-marker-outline" title="Address: 123 Main Street, Anytown, USA" />
                <v-list-item prepend-icon="mdi-phone-outline" title="Phone: +1 (123) 456-7890" />
                <v-list-item prepend-icon="mdi-email-outline" title="Email: info@example.com" />
              </v-list>
              <v-divider class="my-4" />
              <v-form>
                <v-text-field
                  class="mb-4"
                  density="comfortable"
                  label="Your Name"
                  prepend-inner-icon="mdi-account-outline"
                  rounded="pill"
                  variant="outlined"
                />
                <v-text-field
                  class="mb-4"
                  density="comfortable"
                  label="Your Email"
                  prepend-inner-icon="mdi-email-outline"
                  rounded="pill"
                  variant="outlined"
                />
                <v-textarea
                  class="mb-4"
                  density="comfortable"
                  label="Your Message"
                  prepend-inner-icon="mdi-message-text-outline"
                  rounded="lg"
                  rows="4"
                  variant="outlined"
                />
                <v-btn block color="primary" rounded="pill" size="large">Send Message</v-btn>
              </v-form>
            </v-card-text>
          </v-sheet>

          <v-sheet class="pa-4 mb-6" rounded="lg">
            <v-card-title class="text-h6 font-weight-bold mb-4">Impressum / Legal Notice</v-card-title>
            <v-card-text class="text-body-1">
              <p><strong>Company Name:</strong> Example Corp.</p>
              <p><strong>Represented by:</strong> John Doe</p>
              <p><strong>Register Court:</strong> Local Court Anytown</p>
              <p><strong>Register Number:</strong> HRB 12345</p>
              <p><strong>VAT ID:</strong> DE123456789</p>
              <p class="mt-4">
                Disclaimer: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </v-card-text>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  // No specific script logic needed for this static page
</script>
