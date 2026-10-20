import * as migration_20260505_134107_initial from './20260505_134107_initial';
import * as migration_20260505_165603_blog_privacy_expansion from './20260505_165603_blog_privacy_expansion';
import * as migration_20260514_024458_localize_home_sections from './20260514_024458_localize_home_sections';
import * as migration_20260822_034930_contact_requests from './20260822_034930_contact_requests';
import * as migration_20260825_135442_attribution_fields from './20260825_135442_attribution_fields';
import * as migration_20260825_140519_attribution_from_path from './20260825_140519_attribution_from_path';
import * as migration_20260914_160000_contact_email_delivery from './20260914_160000_contact_email_delivery';
import * as migration_20260924_020124_lead_cta_attribution from './20260924_020124_lead_cta_attribution';
import * as migration_20260924_194014_blog_localized_slug from './20260924_194014_blog_localized_slug';
import * as migration_20260925_013853_blog_checklists_links_cta from './20260925_013853_blog_checklists_links_cta';
import * as migration_20260930_042253_remove_billing_page from './20260930_042253_remove_billing_page';
import * as migration_20261008_133454_sales_role from './20261008_133454_sales_role';
import * as migration_20261016_042603_home_cms_parity from './20261016_042603_home_cms_parity';

export const migrations = [
  {
    up: migration_20260505_134107_initial.up,
    down: migration_20260505_134107_initial.down,
    name: '20260505_134107_initial',
  },
  {
    up: migration_20260505_165603_blog_privacy_expansion.up,
    down: migration_20260505_165603_blog_privacy_expansion.down,
    name: '20260505_165603_blog_privacy_expansion',
  },
  {
    up: migration_20260514_024458_localize_home_sections.up,
    down: migration_20260514_024458_localize_home_sections.down,
    name: '20260514_024458_localize_home_sections',
  },
  {
    up: migration_20260822_034930_contact_requests.up,
    down: migration_20260822_034930_contact_requests.down,
    name: '20260822_034930_contact_requests',
  },
  {
    up: migration_20260825_135442_attribution_fields.up,
    down: migration_20260825_135442_attribution_fields.down,
    name: '20260825_135442_attribution_fields',
  },
  {
    up: migration_20260825_140519_attribution_from_path.up,
    down: migration_20260825_140519_attribution_from_path.down,
    name: '20260825_140519_attribution_from_path',
  },
  {
    up: migration_20260914_160000_contact_email_delivery.up,
    down: migration_20260914_160000_contact_email_delivery.down,
    name: '20260914_160000_contact_email_delivery',
  },
  {
    up: migration_20260924_020124_lead_cta_attribution.up,
    down: migration_20260924_020124_lead_cta_attribution.down,
    name: '20260924_020124_lead_cta_attribution',
  },
  {
    up: migration_20260924_194014_blog_localized_slug.up,
    down: migration_20260924_194014_blog_localized_slug.down,
    name: '20260924_194014_blog_localized_slug',
  },
  {
    up: migration_20260925_013853_blog_checklists_links_cta.up,
    down: migration_20260925_013853_blog_checklists_links_cta.down,
    name: '20260925_013853_blog_checklists_links_cta',
  },
  {
    up: migration_20260930_042253_remove_billing_page.up,
    down: migration_20260930_042253_remove_billing_page.down,
    name: '20260930_042253_remove_billing_page',
  },
  {
    up: migration_20261008_133454_sales_role.up,
    down: migration_20261008_133454_sales_role.down,
    name: '20261008_133454_sales_role',
  },
  {
    up: migration_20261016_042603_home_cms_parity.up,
    down: migration_20261016_042603_home_cms_parity.down,
    name: '20261016_042603_home_cms_parity'
  },
];
