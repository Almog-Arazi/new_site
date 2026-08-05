import type { Section } from '../../content.config';

import RichText from './RichText.astro';
import CheckList from './CheckList.astro';
import FeatureGrid from './FeatureGrid.astro';
import ProcessSteps from './ProcessSteps.astro';
import StatRow from './StatRow.astro';
import CalloutBand from './CalloutBand.astro';
import RegulationTable from './RegulationTable.astro';
import LinkCards from './LinkCards.astro';
import EquipmentGrid from './EquipmentGrid.astro';
import PhotoBand from './PhotoBand.astro';
import FaqSection from './FaqSection.astro';
import CtaBand from './CtaBand.astro';

/**
 * FROZEN. Every key here is also a `types:` entry in public/admin/config.yml
 * and a member of the `sectionSchema` union in src/content.config.ts.
 * The three change together or not at all.
 */
export const BLOCKS: Record<Section['type'], unknown> = {
  richText: RichText,
  checkList: CheckList,
  featureGrid: FeatureGrid,
  processSteps: ProcessSteps,
  statRow: StatRow,
  calloutBand: CalloutBand,
  regulationTable: RegulationTable,
  linkCards: LinkCards,
  equipmentGrid: EquipmentGrid,
  photoBand: PhotoBand,
  faq: FaqSection,
  ctaBand: CtaBand,
};

export const BLOCK_TYPES = Object.keys(BLOCKS) as Section['type'][];
