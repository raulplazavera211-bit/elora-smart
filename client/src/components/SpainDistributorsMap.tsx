import { useEffect, useRef, useState } from "react";

// Paths de la Península Ibérica incrustados directamente (sin fetch, sin caché)
const IBERIA_SVG_PATHS: { region: string; d: string }[] = [
  { region: "Castilla-Leon", d: "M 565.2 24.3 L 567.5 26.4 L 567.0 29.1 L 570.6 31.3 L 571.8 33.6 L 576.1 33.8 L 579.5 33.7 L 581.1 32.5 L 583.0 32.9 L 586.3 33.1 L 588.4 35.8 L 593.0 36.4 L 593.1 38.1 L 593.6 40.8 L 595.5 40.7 L 597.1 40.2 L 598.5 41.9 L 601.0 42.4 L 603.1 41.5 L 604.4 42.3 L 607.4 41.6 L 609.5 42.3 L 611.2 40.9 L 613.1 41.5 L 615.5 40.6 L 617.5 41.4 L 619.2 40.4 L 621.9 40.7 L 623.5 39.3 L 626.5 39.3 L 627.2 37.6 L 629.1 36.4 L 628.7 34.3 L 626.6 33.2 L 626.2 31.2 L 627.9 28.8 L 636.1 27.2 L 639.7 27.6 L 637.9 29.3 L 639.7 31.7 L 638.1 33.6 L 643.9 35.9 L 646.5 37.2 L 644.9 38.5 L 641.8 38.9 L 639.5 37.4 L 636.1 36.7 L 635.1 38.4 L 633.8 40.1 L 636.2 41.5 L 638.7 40.8 L 640.9 40.6 L 638.9 43.0 L 639.4 45.1 L 644.9 45.8 L 646.5 47.4 L 649.8 47.8 L 650.1 49.5 L 652.3 50.6 L 653.3 52.2 L 653.1 53.8 L 655.1 52.7 L 655.7 50.9 L 659.2 52.1 L 659.4 55.1 L 660.7 56.9 L 662.4 56.0 L 664.0 56.4 L 666.3 56.6 L 671.5 55.4 L 670.3 51.5 L 668.9 53.3 L 667.6 51.3 L 671.9 50.4 L 674.7 48.3 L 674.7 45.8 L 676.2 43.9 L 678.1 41.7 L 678.0 39.1 L 678.3 37.5 L 680.5 37.4 L 684.1 35.8 L 686.9 34.6 L 687.2 31.8 L 690.4 30.4 L 691.5 28.1 L 691.8 24.8 L 694.1 25.4 L 696.9 23.9 L 697.3 22.2 L 699.6 21.9 L 699.3 20.3 L 697.1 19.3 L 697.0 17.5 L 700.2 17.2 L 703.0 18.0 L 706.1 18.1 L 709.1 19.1 L 711.3 18.6 L 713.2 19.5 L 715.3 18.8 L 717.7 19.0 L 720.2 18.1 L 722.2 18.9 L 724.3 18.4 L 726.1 19.4 L 728.4 19.1 L 730.5 20.2 L 732.3 19.5 L 734.6 20.3 L 736.4 19.9 L 738.3 21.0 L 740.7 20.8 L 742.8 21.9 L 744.6 21.5 L 746.2 22.5 L 748.3 22.1 L 750.2 23.1 L 752.0 22.7 L 753.9 23.7 L 755.7 23.3 L 757.6 24.3 L 759.4 23.9 L 761.3 24.9 L 763.2 24.5 L 765.0 25.5 L 766.9 25.1 L 768.7 26.1 L 770.6 25.7 L 772.4 26.7 L 774.3 26.3 L 776.1 27.3 L 778.0 26.9 L 779.8 27.9 L 781.7 27.5 L 783.5 28.5 L 785.4 28.1 L 787.2 29.1 L 789.1 28.7 L 790.9 29.7 L 792.8 29.3 L 794.6 30.3 L 796.5 29.9 L 798.3 30.9 L 800.2 30.5 L 801.6 43.1 L 800.4 45.2 L 801.1 48.0 L 802.8 50.6 L 805.7 51.4 L 804.6 54.2 L 804.5 56.0 L 802.4 56.7 L 803.8 61.9 L 805.6 63.8 L 802.9 69.6 L 802.7 71.2 L 802.8 73.2 L 800.2 78.0 L 798.0 79.2 L 798.4 81.3 L 798.9 83.3 L 796.7 84.1 L 795.0 85.5 L 793.0 87.9 L 789.4 89.0 L 787.0 92.4 L 787.9 95.1 L 791.3 95.0 L 792.1 97.6 L 789.9 99.8 L 788.2 101.5 L 786.7 104.0 L 787.9 106.8 L 789.5 108.9 L 789.3 110.8 L 786.8 111.3 L 785.5 114.2 L 783.6 115.4 L 781.6 115.5 L 782.4 117.4 L 782.3 119.1 L 784.1 120.4 L 785.6 122.3 L 783.2 126.0 L 784.9 128.7 L 782.9 131.0 L 779.9 131.8 L 781.5 132.9 L 783.1 133.9 L 785.5 134.4 L 784.9 137.0 L 790.2 138.2 L 792.0 139.2 L 792.2 140.8 L 795.0 141.6 L 795.9 139.7 L 798.6 137.3 L 804.8 136.7 L 803.2 138.7 L 801.0 139.2 L 799.3 140.3 L 802.9 139.1 L 805.3 136.5 L 809.9 134.3 L 810.2 132.4 L 808.4 132.5 L 804.1 130.1 L 806.3 131.0 L 804.4 131.1 L 802.8 129.5 L 804.6 128.6 L 809.7 123.3 L 815.0 119.2 L 820.8 117.8 L 822.8 118.6 L 825.0 117.4 L 828.2 115.5 L 832.3 115.3 L 837.4 113.3 L 846.7 112.0 L 855.3 109.6 L 863.0 108.4 L 865.9 104.5 L 865.4 106.5 L 866.5 104.3 L 869.4 101.1 L 873.7 99.8 L 881.6 96.0 L 890.9 93.0 L 892.9 91.2 L 895.8 90.7 L 897.8 89.9 L 901.0 87.6 L 902.9 87.0 L 906.0 84.6 L 909.4 82.0 L 910.5 79.9 L 908.9 77.2 L 909.5 74.8 L 908.0 73.0 L 905.8 72.2 L 905.3 68.9 L 907.4 66.4 L 911.3 66.9 L 912.9 65.6 L 914.2 64.0 L 910.7 62.7 L 908.9 63.3 L 907.0 60.8 L 907.9 59.0 L 904.1 59.4 L 902.2 57.3 L 899.1 57.7 L 897.1 58.1 L 893.7 57.9 L 890.0 59.4 L 885.7 61.1 L 886.6 63.1 L 882.3 62.3 L 880.7 63.4 L 878.5 63.0 L 876.4 60.8 L 869.0 58.8 L 866.8 59.7 L 864.4 59.6 L 861.6 62.1 L 858.7 62.8 L 856.6 61.3 L 855.4 58.1 L 853.5 58.4 L 851.0 56.9 L 845.5 56.6 L 843.5 57.5 L 841.0 57.6 L 839.0 59.1 L 834.9 58.9 L 833.4 56.9 L 834.7 54.4 L 833.1 54.6 L 834.4 51.7 L 832.0 48.9 L 830.8 46.7 L 825.3 46.3 L 822.6 47.1 L 818.9 43.7 L 814.9 43.8 L 812.4 43.7 L 809.4 42.1 L 803.5 40.7 L 800.2 30.5 L 798.3 30.9 L 796.5 29.9 L 794.6 30.3 L 792.8 29.3 L 790.9 29.7 L 789.1 28.7 L 787.2 29.1 L 785.4 28.1 L 783.5 28.5 L 781.7 27.5 L 779.8 27.9 L 778.0 26.9 L 776.1 27.3 L 774.3 26.3 L 772.4 26.7 L 770.6 25.7 L 768.7 26.1 L 766.9 25.1 L 765.0 25.5 L 763.2 24.5 L 761.3 24.9 L 759.4 23.9 L 757.6 24.3 L 755.7 23.3 L 753.9 23.7 L 752.0 22.7 L 750.2 23.1 L 748.3 22.1 L 746.2 22.5 L 744.6 21.5 L 742.8 21.9 L 740.7 20.8 L 738.3 21.0 L 736.4 19.9 L 734.6 20.3 L 732.3 19.5 L 730.5 20.2 L 728.4 19.1 L 726.1 19.4 L 724.3 18.4 L 722.2 18.9 L 720.2 18.1 L 717.7 19.0 L 715.3 18.8 L 713.2 19.5 L 711.3 18.6 L 709.1 19.1 L 706.1 18.1 L 703.0 18.0 L 700.2 17.2 L 697.0 17.5 L 693.9 18.5 L 691.4 20.2 L 688.5 20.9 L 686.8 20.7 L 682.6 22.1 L 679.5 21.1 L 673.1 21.7 L 668.6 20.1 L 666.5 18.3 L 660.7 16.6 L 658.6 17.0 L 656.2 14.8 L 653.9 16.0 L 646.9 16.7 L 644.3 19.6 L 642.5 19.2 L 640.8 19.4 L 639.2 19.3 L 639.0 21.5 L 636.1 21.2 L 633.8 22.0 L 631.2 22.6 L 626.6 24.5 L 627.9 28.8 L 626.2 31.2 L 626.6 33.2 L 628.7 34.3 L 629.1 36.4 L 627.2 37.6 L 626.5 39.3 L 623.5 39.3 L 621.9 40.7 L 619.2 40.4 L 617.5 41.4 L 615.5 40.6 L 613.1 41.5 L 611.2 40.9 L 609.5 42.3 L 607.4 41.6 L 604.4 42.3 L 603.1 41.5 L 601.0 42.4 L 598.5 41.9 L 597.1 40.2 L 595.5 40.7 L 593.6 40.8 L 593.1 38.1 L 593.0 36.4 L 588.4 35.8 L 586.3 33.1 L 583.0 32.9 L 581.1 32.5 L 579.5 33.7 L 576.1 33.8 L 571.8 33.6 L 570.6 31.3 L 567.0 29.1 L 567.5 26.4 L 565.2 24.3 Z M 653.0 43.7 L 657.1 43.4 L 660.8 44.7 L 662.6 44.5 L 664.4 44.8 L 663.8 46.4 L 663.6 48.9 L 666.0 48.2 L 666.2 49.8 L 661.2 49.8 L 655.5 49.0 L 651.3 45.8 L 652.7 43.4 Z" },
  { region: "Cataluña", d: "M 803.5 40.7 L 809.4 42.1 L 812.4 43.7 L 814.9 43.8 L 818.9 43.7 L 822.6 47.1 L 825.3 46.3 L 830.8 46.7 L 832.0 48.9 L 834.4 51.7 L 833.1 54.6 L 834.7 54.4 L 833.4 56.9 L 834.9 58.9 L 839.0 59.1 L 841.0 57.6 L 843.5 57.5 L 845.5 56.6 L 851.0 56.9 L 853.5 58.4 L 855.4 58.1 L 856.6 61.3 L 858.7 62.8 L 861.6 62.1 L 864.4 59.6 L 866.8 59.7 L 869.0 58.8 L 876.4 60.8 L 878.5 63.0 L 880.7 63.4 L 882.3 62.3 L 886.6 63.1 L 885.7 61.1 L 890.0 59.4 L 893.7 57.9 L 897.1 58.1 L 899.1 57.7 L 902.2 57.3 L 904.1 59.4 L 907.9 59.0 L 907.0 60.8 L 908.9 63.3 L 910.7 62.7 L 914.2 64.0 L 912.9 65.6 L 911.3 66.9 L 907.4 66.4 L 905.3 68.9 L 905.8 72.2 L 908.0 73.0 L 909.5 74.8 L 908.9 77.2 L 910.5 79.9 L 909.4 82.0 L 906.0 84.6 L 902.9 87.0 L 901.0 87.6 L 897.8 89.9 L 895.8 90.7 L 892.9 91.2 L 890.9 93.0 L 881.6 96.0 L 873.7 99.8 L 869.4 101.1 L 866.5 104.3 L 865.4 106.5 L 865.9 104.5 L 863.0 108.4 L 855.3 109.6 L 846.7 112.0 L 837.4 113.3 L 832.3 115.3 L 828.2 115.5 L 825.0 117.4 L 822.8 118.6 L 820.8 117.8 L 815.0 119.2 L 809.7 123.3 L 804.6 128.6 L 802.8 129.5 L 804.4 131.1 L 806.3 131.0 L 804.1 130.1 L 808.4 132.5 L 810.2 132.4 L 809.9 134.3 L 805.3 136.5 L 802.9 139.1 L 799.3 140.3 L 801.0 139.2 L 803.2 138.7 L 804.8 136.7 L 798.6 137.3 L 795.9 139.7 L 795.0 141.6 L 792.2 140.8 L 792.0 139.2 L 790.2 138.2 L 784.9 137.0 L 785.5 134.4 L 783.1 133.9 L 781.5 132.9 L 779.9 131.8 L 782.9 131.0 L 784.9 128.7 L 783.2 126.0 L 785.6 122.3 L 784.1 120.4 L 782.3 119.1 L 782.4 117.4 L 781.6 115.5 L 783.6 115.4 L 785.5 114.2 L 786.8 111.3 L 789.3 110.8 L 789.5 108.9 L 787.9 106.8 L 786.7 104.0 L 788.2 101.5 L 789.9 99.8 L 792.1 97.6 L 791.3 95.0 L 787.9 95.1 L 787.0 92.4 L 789.4 89.0 L 793.0 87.9 L 795.0 85.5 L 796.7 84.1 L 798.9 83.3 L 798.4 81.3 L 798.0 79.2 L 800.2 78.0 L 802.8 73.2 L 802.7 71.2 L 802.9 69.6 L 805.6 63.8 L 803.8 61.9 L 802.4 56.7 L 804.5 56.0 L 804.6 54.2 L 805.7 51.4 L 802.8 50.6 L 801.1 48.0 L 800.4 45.2 L 801.6 43.1 L 801.1 41.5 L 803.5 40.7 Z M 857.9 56.8 L 858.6 58.4 L 856.2 58.0 L 857.2 56.4 Z" },
  { region: "Ceuta", d: "M 546.1 342.6 L 544.6 340.7 L 547.2 341.8 L 548.9 341.4 L 546.1 342.6 Z" },
  { region: "Murcia", d: "M 724.3 218.4 L 729.5 222.3 L 730.6 225.9 L 729.5 228.0 L 726.6 231.7 L 727.0 235.7 L 731.1 236.8 L 732.0 238.7 L 731.1 242.0 L 729.1 244.7 L 729.7 247.3 L 734.9 253.9 L 737.8 256.5 L 740.7 257.2 L 741.1 259.8 L 739.3 258.8 L 737.2 261.5 L 739.0 265.4 L 742.2 266.4 L 741.4 263.3 L 741.4 261.5 L 742.0 264.5 L 742.9 266.1 L 742.0 267.8 L 738.3 269.0 L 735.9 268.9 L 734.0 269.9 L 732.3 269.7 L 731.0 267.8 L 729.3 268.8 L 727.5 268.6 L 725.2 270.0 L 723.5 270.4 L 721.6 269.0 L 719.8 269.7 L 716.8 269.5 L 713.6 271.9 L 711.1 272.8 L 710.0 275.6 L 704.0 277.7 L 699.3 274.7 L 696.1 274.3 L 687.6 264.8 L 688.3 262.4 L 687.8 260.3 L 688.3 257.5 L 688.4 255.8 L 683.9 255.9 L 680.8 255.4 L 677.6 253.5 L 675.5 250.5 L 673.6 249.5 L 674.1 247.8 L 677.0 245.7 L 679.1 241.8 L 683.3 240.3 L 686.1 237.4 L 688.9 238.5 L 692.1 237.7 L 697.3 235.2 L 699.0 234.1 L 701.4 234.8 L 702.1 237.2 L 705.6 237.2 L 710.3 234.4 L 710.2 229.9 L 709.4 227.6 L 711.4 225.5 L 711.6 222.6 L 715.0 220.2 L 720.0 218.7 L 722.8 218.0 Z" },
  { region: "Extremadura", d: "M 493.1 144.4 L 503.6 145.1 L 502.5 146.8 L 500.4 146.9 L 495.4 149.2 L 494.6 151.6 L 489.7 152.8 L 487.7 152.6 L 486.1 153.9 L 482.3 153.2 L 481.6 151.3 L 484.5 150.0 L 485.1 148.4 L 482.8 146.6 L 482.1 144.6 L 484.5 142.1 L 484.2 140.4 L 482.3 139.7 L 484.5 135.6 L 482.9 131.7 L 483.5 129.6 L 483.1 127.8 L 483.9 126.1 L 482.2 125.3 L 481.7 123.2 L 479.1 120.8 L 483.9 119.4 L 486.2 116.5 L 488.4 113.2 L 490.7 110.3 L 492.8 110.4 L 496.1 109.1 L 497.9 109.1 L 499.6 107.8 L 500.5 106.0 L 502.1 105.6 L 504.7 104.3 L 505.6 102.4 L 506.1 100.3 L 510.2 96.1 L 505.4 92.4 L 499.3 91.4 L 497.1 92.6 L 494.9 91.4 L 494.9 89.6 L 496.3 83.4 L 494.0 82.8 L 495.0 80.5 L 493.2 79.2 L 488.5 80.7 L 486.3 80.2 L 485.6 78.5 L 483.8 78.1 L 483.3 80.1 L 478.2 80.2 L 476.4 78.9 L 477.4 76.6 L 475.2 75.5 L 476.2 72.5 L 478.1 71.7 L 480.0 69.6 L 482.4 67.9 L 484.8 68.5 L 485.6 66.7 L 486.7 64.9 L 487.1 62.3 L 482.5 60.3 L 483.3 58.2 L 483.1 56.5 L 478.6 55.3 L 476.7 56.5 L 472.5 55.8 L 472.8 53.8 L 473.6 52.0 L 473.8 50.4 L 475.6 50.0 L 473.8 47.8 L 476.9 46.5 L 478.5 45.8 L 481.4 43.8 L 482.5 42.2 L 481.2 40.0 L 482.8 39.7 L 485.2 38.8 L 487.5 38.1 L 497.4 38.0 L 499.8 37.2 L 498.1 36.0 L 500.2 35.1 L 501.4 32.9 L 503.0 32.0 L 506.1 33.0 L 508.6 34.2 L 509.1 32.5 L 510.7 32.5 L 512.4 33.7 L 514.2 33.2 L 514.8 31.3 L 517.4 32.2 L 519.3 31.7 L 520.1 33.8 L 521.9 34.9 L 526.6 36.2 L 528.3 35.9 L 529.8 32.7 L 536.5 33.6 L 539.7 33.6 L 544.1 32.4 L 545.0 30.5 L 548.7 31.2 L 551.5 30.9 L 554.4 29.6 L 556.4 30.2 L 557.5 26.7 L 560.8 27.1 L 562.2 25.4 L 565.2 24.3 L 567.5 26.4 L 567.0 29.1 L 570.6 31.3 L 571.8 33.6 L 576.1 33.8 L 579.5 33.7 L 581.1 32.5 L 583.0 32.9 L 586.3 33.1 L 588.4 35.8 L 593.0 36.4 L 593.1 38.1 L 593.6 40.8 L 595.5 40.7 L 597.1 40.2 L 598.5 41.9 L 601.0 42.4 L 603.1 41.5 L 604.4 42.3 L 607.4 41.6 L 609.5 42.3 L 611.2 40.9 L 613.1 41.5 L 615.5 40.6 L 617.5 41.4 L 619.2 40.4 L 621.9 40.7 L 623.5 39.3 L 626.5 39.3 L 627.2 37.6 L 629.1 36.4 L 628.7 34.3 L 626.6 33.2 L 626.2 31.2 L 627.9 28.8 L 636.1 27.2 L 639.7 27.6 L 637.9 29.3 L 639.7 31.7 L 638.1 33.6 L 643.9 35.9 L 646.5 37.2 L 644.9 38.5 L 641.8 38.9 L 639.5 37.4 L 636.1 36.7 L 635.1 38.4 L 633.8 40.1 L 636.2 41.5 L 638.7 40.8 L 640.9 40.6 L 638.9 43.0 L 639.4 45.1 L 644.9 45.8 L 646.5 47.4 L 649.8 47.8 L 650.1 49.5 L 652.3 50.6 L 653.3 52.2 L 653.1 53.8 L 655.1 52.7 L 655.7 50.9 L 659.2 52.1 L 659.4 55.1 L 660.7 56.9 L 662.4 56.0 L 664.0 56.4 L 666.3 56.6 L 671.5 55.4 L 670.3 51.5 L 668.9 53.3 L 667.6 51.3 L 671.9 50.4 L 674.7 48.3 L 674.7 45.8 L 676.2 43.9 L 678.1 41.7 L 678.0 39.1 L 678.3 37.5 L 680.5 37.4 L 684.1 35.8 L 686.9 34.6 L 687.2 31.8 L 690.4 30.4 L 691.5 28.1 L 691.8 24.8 L 694.1 25.4 L 696.9 23.9 L 697.3 22.2 L 699.6 21.9 L 699.3 20.3 L 697.1 19.3 L 697.0 17.5 L 700.2 17.2 L 703.0 18.0 L 706.1 18.1 L 709.1 19.1 L 711.3 18.6 L 713.2 19.5 L 715.3 18.8 L 717.7 19.0 L 720.2 18.1 L 722.2 18.9 L 724.3 18.4 L 726.1 19.4 L 728.4 19.1 L 730.5 20.2 L 732.3 19.5 L 734.6 20.3 L 736.4 19.9 L 738.3 21.0 L 740.7 20.8 L 742.8 21.9 L 744.6 21.5 L 746.2 22.5 L 748.3 22.1 L 750.2 23.1 L 752.0 22.7 L 753.9 23.7 L 755.7 23.3 L 757.6 24.3 L 759.4 23.9 L 761.3 24.9 L 763.2 24.5 L 765.0 25.5 L 766.9 25.1 L 768.7 26.1 L 770.6 25.7 L 772.4 26.7 L 774.3 26.3 L 776.1 27.3 L 778.0 26.9 L 779.8 27.9 L 781.7 27.5 L 783.5 28.5 L 785.4 28.1 L 787.2 29.1 L 789.1 28.7 L 790.9 29.7 L 792.8 29.3 L 794.6 30.3 L 796.5 29.9 L 798.3 30.9 L 800.2 30.5 L 801.6 43.1 L 800.4 45.2 L 801.1 48.0 L 802.8 50.6 L 805.7 51.4 L 804.6 54.2 L 804.5 56.0 L 802.4 56.7 L 803.8 61.9 L 805.6 63.8 L 802.9 69.6 L 802.7 71.2 L 802.8 73.2 L 800.2 78.0 L 798.0 79.2 L 798.4 81.3 L 798.9 83.3 L 796.7 84.1 L 795.0 85.5 L 793.0 87.9 L 789.4 89.0 L 787.0 92.4 L 787.9 95.1 L 791.3 95.0 L 792.1 97.6 L 789.9 99.8 L 788.2 101.5 L 786.7 104.0 L 787.9 106.8 L 789.5 108.9 L 789.3 110.8 L 786.8 111.3 L 785.5 114.2 L 783.6 115.4 L 781.6 115.5 L 782.4 117.4 L 782.3 119.1 L 784.1 120.4 L 785.6 122.3 L 783.2 126.0 L 784.9 128.7 L 782.9 131.0 L 779.9 131.8 L 781.5 132.9 L 783.1 133.9 L 785.5 134.4 L 784.9 137.0 L 790.2 138.2 L 792.0 139.2 L 792.2 140.8 L 795.0 141.6 L 795.9 139.7 L 798.6 137.3 L 804.8 136.7 L 803.2 138.7 L 801.0 139.2 L 799.3 140.3 L 802.9 139.1 L 805.3 136.5 L 809.9 134.3 L 810.2 132.4 L 808.4 132.5 L 804.1 130.1 L 806.3 131.0 L 804.4 131.1 L 802.8 129.5 L 804.6 128.6 L 809.7 123.3 L 815.0 119.2 L 820.8 117.8 L 822.8 118.6 L 825.0 117.4 L 828.2 115.5 L 832.3 115.3 L 837.4 113.3 L 846.7 112.0 L 855.3 109.6 L 863.0 108.4 L 865.9 104.5 L 865.4 106.5 L 866.5 104.3 L 869.4 101.1 L 873.7 99.8 L 881.6 96.0 L 890.9 93.0 L 892.9 91.2 L 895.8 90.7 L 897.8 89.9 L 901.0 87.6 L 902.9 87.0 L 906.0 84.6 L 909.4 82.0 L 910.5 79.9 L 908.9 77.2 L 909.5 74.8 L 908.0 73.0 L 905.8 72.2 L 905.3 68.9 L 907.4 66.4 L 911.3 66.9 L 912.9 65.6 L 914.2 64.0 L 910.7 62.7 L 908.9 63.3 L 907.0 60.8 L 907.9 59.0 L 904.1 59.4 L 902.2 57.3 L 899.1 57.7 L 897.1 58.1 L 893.7 57.9 L 890.0 59.4 L 885.7 61.1 L 886.6 63.1 L 882.3 62.3 L 880.7 63.4 L 878.5 63.0 L 876.4 60.8 L 869.0 58.8 L 866.8 59.7 L 864.4 59.6 L 861.6 62.1 L 858.7 62.8 L 856.6 61.3 L 855.4 58.1 L 853.5 58.4 L 851.0 56.9 L 845.5 56.6 L 843.5 57.5 L 841.0 57.6 L 839.0 59.1 L 834.9 58.9 L 833.4 56.9 L 834.7 54.4 L 833.1 54.6 L 834.4 51.7 L 832.0 48.9 L 830.8 46.7 L 825.3 46.3 L 822.6 47.1 L 818.9 43.7 L 814.9 43.8 L 812.4 43.7 L 809.4 42.1 L 803.5 40.7 Z M 493.1 144.4 L 503.6 145.1 L 502.5 146.8 L 500.4 146.9 L 495.4 149.2 L 494.6 151.6 L 489.7 152.8 L 487.7 152.6 L 486.1 153.9 L 482.3 153.2 L 481.6 151.3 L 484.5 150.0 L 485.1 148.4 L 482.8 146.6 L 482.1 144.6 L 484.5 142.1 L 484.2 140.4 L 482.3 139.7 L 484.5 135.6 L 482.9 131.7 L 483.5 129.6 L 483.1 127.8 L 483.9 126.1 L 482.2 125.3 L 481.7 123.2 L 479.1 120.8 L 483.9 119.4 L 486.2 116.5 L 488.4 113.2 L 490.7 110.3 L 492.8 110.4 L 496.1 109.1 L 497.9 109.1 L 499.6 107.8 L 500.5 106.0 L 502.1 105.6 L 504.7 104.3 L 505.6 102.4 L 506.1 100.3 L 510.2 96.1 L 505.4 92.4 L 499.3 91.4 L 497.1 92.6 L 494.9 91.4 L 494.9 89.6 L 496.3 83.4 L 494.0 82.8 L 495.0 80.5 L 493.2 79.2 L 488.5 80.7 L 486.3 80.2 L 485.6 78.5 L 483.8 78.1 L 483.3 80.1 L 478.2 80.2 L 476.4 78.9 L 477.4 76.6 L 475.2 75.5 L 476.2 72.5 L 478.1 71.7 L 480.0 69.6 L 482.4 67.9 L 484.8 68.5 L 485.6 66.7 L 486.7 64.9 L 487.1 62.3 L 482.5 60.3 L 483.3 58.2 L 483.1 56.5 L 478.6 55.3 L 476.7 56.5 L 472.5 55.8 L 472.8 53.8 L 473.6 52.0 L 473.8 50.4 L 475.6 50.0 L 473.8 47.8 L 476.9 46.5 L 478.5 45.8 L 481.4 43.8 L 482.5 42.2 L 481.2 40.0 L 482.8 39.7 L 485.2 38.8 L 487.5 38.1 L 497.4 38.0 L 499.8 37.2 L 498.1 36.0 L 500.2 35.1 L 501.4 32.9 L 503.0 32.0 L 506.1 33.0 L 508.6 34.2 L 509.1 32.5 L 510.7 32.5 L 512.4 33.7 L 514.2 33.2 L 514.8 31.3 L 517.4 32.2 L 519.3 31.7 L 520.1 33.8 L 521.9 34.9 L 526.6 36.2 L 528.3 35.9 L 529.8 32.7 L 536.5 33.6 L 539.7 33.6 L 544.1 32.4 L 545.0 30.5 L 548.7 31.2 L 551.5 30.9 L 554.4 29.6 L 556.4 30.2 L 557.5 26.7 L 560.8 27.1 L 562.2 25.4 L 565.2 24.3 Z" },
  { region: "Andalucia", d: "M 493.1 144.4 L 503.6 145.1 L 502.5 146.8 L 500.4 146.9 L 495.4 149.2 L 494.6 151.6 L 489.7 152.8 L 487.7 152.6 L 486.1 153.9 L 482.3 153.2 L 481.6 151.3 L 484.5 150.0 L 485.1 148.4 L 482.8 146.6 L 482.1 144.6 L 484.5 142.1 L 484.2 140.4 L 482.3 139.7 L 484.5 135.6 L 482.9 131.7 L 483.5 129.6 L 483.1 127.8 L 483.9 126.1 L 482.2 125.3 L 481.7 123.2 L 479.1 120.8 L 483.9 119.4 L 486.2 116.5 L 488.4 113.2 L 490.7 110.3 L 492.8 110.4 L 496.1 109.1 L 497.9 109.1 L 499.6 107.8 L 500.5 106.0 L 502.1 105.6 L 504.7 104.3 L 505.6 102.4 L 506.1 100.3 L 510.2 96.1 L 505.4 92.4 L 499.3 91.4 L 497.1 92.6 L 494.9 91.4 L 494.9 89.6 L 496.3 83.4 L 494.0 82.8 L 495.0 80.5 L 493.2 79.2 L 488.5 80.7 L 486.3 80.2 L 485.6 78.5 L 483.8 78.1 L 483.3 80.1 L 478.2 80.2 L 476.4 78.9 L 477.4 76.6 L 475.2 75.5 L 476.2 72.5 L 478.1 71.7 L 480.0 69.6 L 482.4 67.9 L 484.8 68.5 L 485.6 66.7 L 486.7 64.9 L 487.1 62.3 L 482.5 60.3 L 483.3 58.2 L 483.1 56.5 L 478.6 55.3 L 476.7 56.5 L 472.5 55.8 L 472.8 53.8 L 473.6 52.0 L 473.8 50.4 L 475.6 50.0 L 473.8 47.8 L 476.9 46.5 L 478.5 45.8 L 481.4 43.8 L 482.5 42.2 L 481.2 40.0 L 482.8 39.7 L 485.2 38.8 L 487.5 38.1 L 497.4 38.0 L 499.8 37.2 L 498.1 36.0 L 500.2 35.1 L 501.4 32.9 L 503.0 32.0 L 506.1 33.0 L 508.6 34.2 L 509.1 32.5 L 510.7 32.5 L 512.4 33.7 L 514.2 33.2 L 514.8 31.3 L 517.4 32.2 L 519.3 31.7 L 520.1 33.8 L 521.9 34.9 L 526.6 36.2 L 528.3 35.9 L 529.8 32.7 L 536.5 33.6 L 539.7 33.6 L 544.1 32.4 L 545.0 30.5 L 548.7 31.2 L 551.5 30.9 L 554.4 29.6 L 556.4 30.2 L 557.5 26.7 L 560.8 27.1 L 562.2 25.4 L 565.2 24.3 Z" },
  { region: "Galicia", d: "M 493.1 55.8 L 486.4 58.1 L 468.2 64.7 L 442.7 64.7 L 422.0 64.7 L 421.4 69.3 L 424.2 76.2 L 425.5 81.5 L 427.7 89.0 L 428.4 98.5 L 428.4 105.1 L 425.2 115.0 L 421.0 120.6 L 417.2 131.4 L 410.8 138.0 L 403.8 143.9 L 404.5 147.8 L 403.8 156.0 L 403.8 159.3 L 401.3 164.2 L 401.9 169.8 L 409.2 175.7 L 406.1 180.7 L 407.6 186.3 L 409.2 192.2 L 417.2 197.1 L 420.4 200.4 L 423.6 205.3 L 423.9 213.2 L 422.0 220.1 L 420.4 224.7 L 433.1 225.0 L 449.1 225.0 L 451.3 225.0 L 458.6 223.4 L 467.9 219.1 L 467.9 207.9 L 474.6 202.0 L 474.6 195.4 L 477.8 188.9 L 470.4 177.7 L 474.6 170.8 L 477.8 167.9 L 471.4 162.6 L 465.3 156.0 L 469.8 149.5 L 473.0 144.5 L 477.8 141.2 L 479.4 137.3 L 482.5 133.0 L 485.7 126.5 L 487.3 119.9 L 488.0 113.3 L 488.0 108.4 L 486.7 101.8 L 485.7 93.6 L 485.7 87.0 L 485.7 82.1 L 495.6 76.5 L 500.1 70.6 L 506.8 64.7 L 500.1 59.1 L 493.1 55.8 Z" },
  { region: "Portugal", d: "M 493.1 55.8 L 486.4 58.1 L 468.2 64.7 L 442.7 64.7 L 422.0 64.7 L 421.4 69.3 L 424.2 76.2 L 425.5 81.5 L 427.7 89.0 L 428.4 98.5 L 428.4 105.1 L 425.2 115.0 L 421.0 120.6 L 417.2 131.4 L 410.8 138.0 L 403.8 143.9 L 404.5 147.8 L 403.8 156.0 L 403.8 159.3 L 401.3 164.2 L 401.9 169.8 L 409.2 175.7 L 406.1 180.7 L 407.6 186.3 L 409.2 192.2 L 417.2 197.1 L 420.4 200.4 L 423.6 205.3 L 423.9 213.2 L 422.0 220.1 L 420.4 224.7 L 433.1 225.0 L 449.1 225.0 L 451.3 225.0 L 458.6 223.4 L 467.9 219.1 L 467.9 207.9 L 474.6 202.0 L 474.6 195.4 L 477.8 188.9 L 470.4 177.7 L 474.6 170.8 L 477.8 167.9 L 471.4 162.6 L 465.3 156.0 L 469.8 149.5 L 473.0 144.5 L 477.8 141.2 L 479.4 137.3 L 482.5 133.0 L 485.7 126.5 L 487.3 119.9 L 488.0 113.3 L 488.0 108.4 L 486.7 101.8 L 485.7 93.6 L 485.7 87.0 L 485.7 82.1 L 495.6 76.5 L 500.1 70.6 L 506.8 64.7 L 500.1 59.1 L 493.1 55.8 Z" },
];

// ViewBox del SVG real: 0 0 960 700
// Límites geográficos usados en la proyección: lon [-18.2, 4.4], lat [27.6, 43.8]
const VW = 960, VH = 700;
// ViewBox por defecto con zoom: recorta márgenes para que España ocupe más pantalla
const DEFAULT_VB = "240 -100 700 500";
const LON_MIN = -18.2, LON_MAX = 4.4;
const LAT_MIN = 27.6, LAT_MAX = 43.8;

function gpsToSvg(lat: number, lon: number) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * VW;
  const y = (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * VH;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

interface Distributor {
  id: number;
  name: string;
  address: string;
  city: string;
  cp: string;
  province: string;
  region: string;
  type: string;
  phone: string | null;
  email: string | null;
  lat: number;
  lon: number;
}

const DISTRIBUTORS: Distributor[] = [
  { id: 1,  name: "Almacenes Mariña Gamma",           address: "Travesía de Montouto, 11",              city: "Teo",                    cp: "15883", province: "A Coruña",        region: "Galicia",              type: "Distribuidor oficial",       phone: null,              email: "administracion@almacenesmarina.com", lat: 42.836, lon: -8.571 },
  { id: 2,  name: "Boiro Tenda",                       address: "Avda. Constitución, 29",                city: "Boiro",                  cp: "15930", province: "A Coruña",        region: "Galicia",              type: "Distribuidor oficial",       phone: "+34 678 076 281", email: "info@boirotenda.com",               lat: 42.648, lon: -8.882 },
  { id: 3,  name: "Santiago Criado",                   address: "Carretera de Valladolid, 113-123",      city: "Villares de la Reina",   cp: "37184", province: "Salamanca",       region: "Castilla y León",      type: "Distribuidor oficial",       phone: "+34 923 282 349", email: "gerencia@santiagocriado.com",       lat: 40.983, lon: -5.624 },
  { id: 4,  name: "OAB 4.0 SL",                        address: "Calle General Manso, 32, Local 5",      city: "Sant Feliu de Llobregat",cp: "08980", province: "Barcelona",       region: "Cataluña",             type: "Distribuidor",               phone: "+34 699 44 46 49",email: "oscar@oab40.cat",                  lat: 41.380, lon: 2.045  },
  { id: 5,  name: "Nahar Gres – Alcobendas",           address: "Paseo de la Chopera, 182",              city: "Alcobendas",             cp: "28100", province: "Madrid",          region: "Comunidad de Madrid",  type: "Distribuidor",               phone: null,              email: null,                                lat: 40.547, lon: -3.639 },
  { id: 6,  name: "Nahar Gres – Alcalá de Henares",   address: "C. Valdemorillo, 7, Bajo Local 1",      city: "Alcalá de Henares",      cp: "28805", province: "Madrid",          region: "Comunidad de Madrid",  type: "Distribuidor",               phone: "+34 918 88 10 34",email: null,                                lat: 40.482, lon: -3.360 },
  { id: 7,  name: "La Flecha (Cerámicas La Flecha)",   address: "Calle Caldereros, Parcela 3, Nave 7",   city: "Villanubla",             cp: "47620", province: "Valladolid",      region: "Castilla y León",      type: "Distribuidor",               phone: null,              email: null,                                lat: 41.700, lon: -4.827 },
  { id: 8,  name: "Barbanza Baños",                    address: "Calle Venezuela, 60 Bajo",              city: "Vigo",                   cp: "36204", province: "Pontevedra",      region: "Galicia",              type: "Distribuidor",               phone: null,              email: null,                                lat: 42.231, lon: -8.712 },
  { id: 9,  name: "Materials Carmen",                  address: "Carrer de Barcelona, 455",              city: "Sant Vicenç dels Horts", cp: "08620", province: "Barcelona",       region: "Cataluña",             type: "Distribuidor",               phone: null,              email: null,                                lat: 41.393, lon: 2.002  },
  { id: 10, name: "Pariente Ballesteros",               address: "Calle Horno, 7",                        city: "El Saucejo",             cp: "41650", province: "Sevilla",         region: "Andalucía",            type: "Distribuidor",               phone: null,              email: null,                                lat: 37.053, lon: -5.080 },
  { id: 11, name: "Almacenes Franganillo",              address: "Carretera Páramo, s/n, Requejo de la Vega", city: "León",              cp: "24240", province: "León",            region: "Castilla y León",      type: "Distribuidor",               phone: null,              email: null,                                lat: 42.282, lon: -5.991 },
  { id: 12, name: "TEIX Arquitectura",                  address: "Carrer de Can Granada, 9, Centre",     city: "Palma",                  cp: "07012", province: "Illes Balears",   region: "Islas Baleares",       type: "Distribuidor / Prescriptor", phone: null,              email: null,                                lat: 39.571, lon: 2.646  },
  { id: 13, name: "KASTALIA",                           address: "Av. de Buenos Aires, 33",               city: "Santa Cruz de Tenerife", cp: "38003", province: "Tenerife",        region: "Canarias",             type: "Distribuidor",               phone: "+34 615 38 33 22",email: null,                                lat: 28.463, lon: -16.251},
  { id: 14, name: "Puya",                               address: "C. Polonia, 10",                        city: "Marbella",               cp: "29670", province: "Málaga",          region: "Andalucía",            type: "Distribuidor",               phone: "+34 952 78 35 40",email: null,                                lat: 36.510, lon: -4.886 },
  { id: 15, name: "LOOXUR BY PUYA",                        address: "Pol. Ind. La Erminta, C/Zinc, N.7",     city: "Marbella",               cp: "29600", province: "Málaga",          region: "Andalucía",            type: "Distribuidor",               phone: null,              email: null,                                lat: 36.523, lon: -4.916 },
  { id: 16, name: "GRUPO PUYA 68 SL",                      address: "C/Polonia, N.10",                       city: "San Pedro Alcántara",    cp: "29670", province: "Málaga",          region: "Andalucía",            type: "Distribuidor",               phone: null,              email: null,                                lat: 36.490, lon: -4.993 },
  { id: 17, name: "Okgrés",                               address: "Estr. de Manique 1512",                 city: "Alcabideche",            cp: "2645-550", province: "Lisboa",          region: "Portugal",             type: "Distribuidor",               phone: null,              email: null,                                lat: 38.726, lon: -9.421 },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function SpainDistributorsMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cp, setCp] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ nearest: Distributor; km: number; cpCity: string } | null>(null);
  const [searchError, setSearchError] = useState("");
  // Zoom animado: viewBox del SVG
  const [viewBox, setViewBox] = useState(DEFAULT_VB);
  const viewBoxRef = useRef(DEFAULT_VB);
  const animFrameRef = useRef<number | null>(null);

  // Paths incrustados directamente (sin fetch, sin caché)
  const svgPaths = IBERIA_SVG_PATHS;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (!visible || searchResult) return;
    let i = 0;
    const iv = setInterval(() => { setSelected(DISTRIBUTORS[i].id); i = (i + 1) % DISTRIBUTORS.length; }, 2200);
    return () => clearInterval(iv);
  }, [visible, searchResult]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = cp.trim().replace(/\s/g, "");
    if (!/^\d{5}$/.test(cleaned)) { setSearchError("Introduce un código postal válido de 5 dígitos"); return; }
    setSearching(true); setSearchError(""); setSearchResult(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/es/${cleaned}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) throw new Error();
      const userLat = parseFloat(place.latitude);
      const userLon = parseFloat(place.longitude);
      const cpCity = place["place name"];
      const cpIsCanarias = cleaned.startsWith("35") || cleaned.startsWith("38");
      const candidates = cpIsCanarias ? DISTRIBUTORS.filter(d => d.region === "Canarias") : DISTRIBUTORS.filter(d => d.region !== "Canarias");
      let nearest = candidates[0]; let minKm = Infinity;
      for (const d of candidates) { const km = haversineKm(userLat, userLon, d.lat, d.lon); if (km < minKm) { minKm = km; nearest = d; } }
      setSearchResult({ nearest, km: Math.round(minKm), cpCity });
      setSelected(nearest.id);
      // Zoom animado al distribuidor más cercano
      const targetPos = gpsToSvg(nearest.lat, nearest.lon);
      const zoomW = 280, zoomH = 200;
      const targetVB = `${targetPos.x - zoomW / 2} ${targetPos.y - zoomH / 2} ${zoomW} ${zoomH}`;
      animateViewBox(viewBoxRef.current, targetVB, 900);
    } catch { setSearchError("No encontramos ese código postal. Inténtalo de nuevo."); }
    finally { setSearching(false); }
  }

  const activeId = hovered ?? selected;
  const activeD = activeId ? DISTRIBUTORS.find(d => d.id === activeId) : null;

  // Función de zoom animado con lerp
  function animateViewBox(from: string, to: string, duration: number) {
    const parseVB = (s: string) => s.split(' ').map(Number);
    const [fx, fy, fw, fh] = parseVB(from);
    const [tx, ty, tw, th] = parseVB(to);
    const start = performance.now();
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const e = ease(t);
      const vb = `${fx + (tx - fx) * e} ${fy + (ty - fy) * e} ${fw + (tw - fw) * e} ${fh + (th - fh) * e}`;
      viewBoxRef.current = vb;
      setViewBox(vb);
      if (t < 1) animFrameRef.current = requestAnimationFrame(step);
    }
    animFrameRef.current = requestAnimationFrame(step);
  }

  // Reset zoom al limpiar búsqueda
  function resetZoom() {
    animateViewBox(viewBoxRef.current, DEFAULT_VB, 700);
  }

  // Región activa para resaltar en el mapa
  const activeRegion = activeD?.region;
  const regionMap: Record<string, string> = {
    "Galicia": "Galicia", "Castilla y León": "Castilla-Leon", "Cataluña": "Cataluña",
    "Comunidad de Madrid": "Madrid", "Andalucía": "Andalucia", "Islas Baleares": "Baleares",
    "Canarias": "Canarias",
  };

  return (
    <section ref={sectionRef} className="w-full bg-background py-20 md:py-28 overflow-hidden">
      <style>{`
        @keyframes dist-fade-up { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dot-pop { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.3); } 100% { transform:scale(1); opacity:1; } }
        @keyframes ring-out { 0% { r:5px; opacity:0.8; } 80% { r:22px; opacity:0; } 100% { r:22px; opacity:0; } }
        @keyframes ring-out2 { 0% { r:4px; opacity:0.5; } 80% { r:14px; opacity:0; } 100% { r:14px; opacity:0; } }
        @keyframes card-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes dist-reveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }
        @keyframes dist-line-grow { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        .dist-dot { transform-origin: center; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .spain-region { transition: fill 0.35s ease, opacity 0.35s ease; }
        .spain-region:hover { cursor: pointer; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* CABECERA ÉPICA */}
        <div className="mb-12 md:mb-16">

          {/* Layout 2 columnas en desktop */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
          <div className="flex-1 min-w-0">

          {/* Eyebrow con líneas laterales */}
          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}
            className="flex items-center gap-3 mb-7">
            <div style={{ width: visible ? "40px" : "0px", transition: "width 0.7s cubic-bezier(0.23,1,0.32,1) 0.2s", height: "1px", background: "#E87A3D" }} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-accent-deep whitespace-nowrap">Red de distribución oficial</p>
            <div style={{ width: visible ? "40px" : "0px", transition: "width 0.7s cubic-bezier(0.23,1,0.32,1) 0.4s", height: "1px", background: "#E87A3D" }} />
          </div>

          {/* Título — revelado línea a línea */}
          <div style={{ overflow: "hidden", marginBottom: "4px" }}>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-foreground leading-[0.9]"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(70px)", transition: "opacity 0.75s cubic-bezier(0.23,1,0.32,1) 0.3s, transform 0.75s cubic-bezier(0.23,1,0.32,1) 0.3s" }}>
              Encuentra tu
            </h2>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "24px" }}>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.9]"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(70px)", transition: "opacity 0.75s cubic-bezier(0.23,1,0.32,1) 0.5s, transform 0.75s cubic-bezier(0.23,1,0.32,1) 0.5s", color: "#E87A3D" }}>
              Distribuidor
            </h2>
          </div>

          {/* Línea de luz */}
          <div style={{ position: "relative", height: "2px", maxWidth: "600px", marginBottom: "32px", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(232,122,61,0.12)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, #E87A3D 40%, #fff8 60%, #E87A3D 80%, transparent 100%)", transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 1.1s cubic-bezier(0.23,1,0.32,1) 0.7s" }} />
          </div>

          {/* Contadores */}
          <div className="flex items-center gap-8 md:gap-14">
            {[
              { val: DISTRIBUTORS.length, label: "Distribuidores", color: "#E87A3D", delay: "0.85s" },
              { val: 7, label: "Comunidades", color: "inherit", delay: "1s" },
              { val: 2, label: "Países", color: "inherit", delay: "1.15s" },
            ].map((item, i) => (
              <>
                {i > 0 && <div key={`sep-${i}`} style={{ width: "1px", height: "44px", background: "rgba(255,255,255,0.1)", opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${item.delay}` }} />}
                <div key={item.label} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${item.delay}, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${item.delay}` }}>
                  <p className="font-display text-5xl md:text-6xl leading-none tabular-nums" style={{ color: item.color === "inherit" ? undefined : item.color }}>{item.val}</p>
                  <p className="font-body text-[9px] uppercase tracking-[0.35em] text-foreground/40 mt-2">{item.label}</p>
                </div>
              </>
            ))}
          </div>
          </div>{/* fin col izq */}

          {/* Columna derecha: Sé distribuidor */}
          <div
            className="hidden lg:flex flex-col justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease 1.2s, transform 0.7s cubic-bezier(0.23,1,0.32,1) 1.2s",
              minWidth: "280px", maxWidth: "320px",
            border: "1px solid rgba(232,122,61,0.3)",
            padding: "32px 28px",
            background: "transparent",
            position: "relative",
            }}
          >
            {/* Esquinas decorativas */}
            <div style={{ position: "absolute", top: 0, right: 0, width: "18px", height: "18px", borderTop: "2px solid #E87A3D", borderRight: "2px solid #E87A3D" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "18px", height: "18px", borderBottom: "2px solid #E87A3D", borderLeft: "2px solid #E87A3D" }} />

            <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent-deep mb-3">¿Quieres vender Elora?</p>
            <h3 className="font-display text-3xl uppercase tracking-tight text-foreground leading-[0.95] mb-3 whitespace-nowrap">
              Sé <span style={{ color: "#E87A3D" }}>distribuidor</span>
            </h3>
            <p className="font-body text-[12px] text-foreground/60 leading-relaxed mb-6">
              Únete a nuestra red oficial y ofrece los inodoros inteligentes más avanzados del mercado.
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/34614451901?text=Hola%2C%20me%20interesa%20ser%20distribuidor%20de%20Elora%20Smart"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-white no-underline font-display text-[11px] uppercase tracking-[0.2em] font-semibold transition-opacity hover:opacity-85"
                style={{ background: "#25D366", borderRadius: "2px" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href="tel:+34614451901"
                className="flex items-center gap-3 px-4 py-3 text-foreground no-underline font-display text-[11px] uppercase tracking-[0.2em] font-semibold border border-border hover:border-accent-deep transition-colors"
                style={{ borderRadius: "2px" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                +34 614 451 901
              </a>
            </div>
          </div>
          </div>{/* fin layout 2 col */}

        </div>

        {/* Buscador CP */}
        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }} className="mb-10 md:mb-14">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-deep">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text" inputMode="numeric" maxLength={5} value={cp}
                onChange={e => { setCp(e.target.value.replace(/\D/g, "")); setSearchError(""); setSearchResult(null); resetZoom(); }}
                placeholder="Introduce tu código postal"
                className="w-full pl-10 pr-4 py-3.5 bg-card border border-border text-foreground font-body text-sm placeholder:text-foreground/30 outline-none focus:border-accent-deep transition-colors duration-200"
                style={{ borderRadius: "2px" }}
              />
            </div>
            <button type="submit" disabled={searching}
              className="px-8 py-3.5 bg-foreground text-background font-display text-[11px] uppercase tracking-[0.25em] hover:bg-accent-deep transition-colors duration-200 disabled:opacity-50 flex items-center gap-2 justify-center"
              style={{ borderRadius: "2px", minWidth: "140px" }}>
              {searching ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Buscando</>
              ) : "Buscar"}
            </button>
          </form>
          {searchError && <p className="mt-2 font-body text-[11px] text-red-500/80 tracking-wide">{searchError}</p>}
          {searchResult && (
            <div className="mt-4 flex items-center gap-3 p-4 border border-accent-deep/30 bg-accent-deep/5 max-w-xl" style={{ borderRadius: "2px", animation: "card-in 0.4s ease both" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#E87A3D", flexShrink:0, boxShadow:"0 0 10px #E87A3D" }} />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent-deep mb-0.5">Distribuidor más cercano a {searchResult.cpCity}</p>
                <p className="font-display text-base uppercase tracking-wide text-foreground">{searchResult.nearest.name}</p>
                <p className="font-body text-[11px] text-foreground/50 mt-0.5">{searchResult.nearest.city} · {searchResult.nearest.province} · <strong className="text-accent-deep">{searchResult.km} km</strong></p>
              </div>
            </div>
          )}
        </div>

        {/* Mapa + Panel */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* SVG Mapa real de España */}
          <div className="w-full lg:w-[65%]"
            style={{ opacity: visible ? 1 : 0, animation: visible ? "dist-fade-up 1s cubic-bezier(0.23,1,0.32,1) 0.3s both" : "none" }}>
            <svg viewBox={viewBox} className="w-full h-auto" style={{ maxHeight: "720px", transition: "none" }}>
              <defs>
                <filter id="dotGlow2">
                  <feGaussianBlur stdDeviation="3" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="mapShadow2">
                  <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#001F3F" floodOpacity="0.2"/>
                </filter>
              </defs>

              {/* Portugal */}
              <path
                d="M 493.1 55.8 L 481.0 59.1 L 468.2 64.7 L 442.7 64.7 L 422.0 64.7 L 424.2 76.2 L 427.7 89.0 L 428.4 105.1 L 421.0 120.6 L 417.2 131.4 L 403.8 143.9 L 403.8 159.3 L 401.9 169.8 L 406.1 180.7 L 409.2 192.2 L 420.4 200.4 L 423.9 213.2 L 420.4 224.7 L 451.3 225.0 L 467.9 219.1 L 467.9 207.9 L 474.6 195.4 L 470.4 177.7 L 477.8 167.9 L 465.3 156.0 L 473.0 144.5 L 479.4 137.3 L 485.7 126.5 L 488.0 108.4 L 485.7 93.6 L 485.7 82.1 L 495.6 76.5 L 506.8 64.7 L 493.1 55.8 Z"
                fill="#001F3F"
                stroke="#E87A3D"
                strokeWidth="0.8"
                strokeOpacity={0.25}
                filter="url(#mapShadow2)"
              />

              {/* Comunidades autónomas reales */}
              {svgPaths.map(({ region, d }) => {
                const svgRegion = regionMap[activeRegion || ""] || "";
                const isActive = svgRegion && region === svgRegion;
                return (
                  <path
                    key={region}
                    d={d}
                    className="spain-region"
                    fill={isActive ? "rgba(232,122,61,0.18)" : "#001F3F"}
                    stroke="#E87A3D"
                    strokeWidth={isActive ? "1.5" : "0.8"}
                    strokeOpacity={isActive ? 0.6 : 0.25}
                    filter="url(#mapShadow2)"
                  />
                );
              })}

              {/* Puntos de distribuidores */}
              {(() => {
                // Offsets manuales para etiquetas de distribuidores cercanos (evita solapamiento)
                // [dx, dy, anchor] donde dx/dy son offsets adicionales a la posición base
                const LABEL_OFFSETS: Record<number, [number, number, "start" | "end" | "middle"]> = {
                  1:  [0,   -8,  "start"],  // Teo — arriba
                  2:  [0,   14,  "start"],  // Boiro — abajo
                  8:  [-9,   4,  "end"],    // Vigo — izquierda
                  4:  [9,  -10,  "start"],  // Sant Feliu — arriba
                  9:  [9,   12,  "start"],  // Sant Vicenç — abajo
                  5:  [0,  -10,  "start"],  // Alcobendas — arriba
                  6:  [0,   12,  "start"],  // Alcalá de Henares — abajo
                  10: [-9,  -10, "end"],    // El Saucejo — arriba izq
                  14: [-9,   12, "end"],    // Marbella — abajo izq
                };
                return DISTRIBUTORS.map((d, i) => {
                  const pos = gpsToSvg(d.lat, d.lon);
                  const isActive = activeId === d.id;
                  const defaultDx = pos.x > VW / 2 ? -9 : 9;
                  const defaultAnchor = pos.x > VW / 2 ? "end" : "start";
                  const [ldx, ldy, lanchor] = LABEL_OFFSETS[d.id] ?? [defaultDx, -10, defaultAnchor as "start" | "end" | "middle"];
                  return (
                    <g key={d.id}
                      className="dist-dot"
                      style={{ animationDelay: `${0.6 + i * 0.08}s`, cursor: "pointer" }}
                      onMouseEnter={() => setHovered(d.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(d.id === selected ? null : d.id)}
                    >
                      {/* Anillos pulsantes */}
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 7 : 5} fill="none" stroke="#E87A3D"
                        strokeWidth={isActive ? 1.5 : 1} opacity={isActive ? 0.7 : 0.3}
                        style={{ animation: `ring-out ${1.6 + i * 0.15}s ease-out infinite`, animationDelay: `${i * 0.2}s` }} />
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 5 : 3.5} fill="none" stroke="#E87A3D"
                        strokeWidth="0.8" opacity={isActive ? 0.45 : 0.12}
                        style={{ animation: `ring-out2 ${2 + i * 0.12}s ease-out infinite`, animationDelay: `${i * 0.25 + 0.3}s` }} />
                      {/* Punto central */}
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 5.5 : 3.5}
                        fill="#E87A3D" opacity={isActive ? 1 : 0.7}
                        filter={isActive ? "url(#dotGlow2)" : undefined}
                        style={{ transition: "all 0.3s ease" }} />
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 2.2 : 1.5} fill="white" opacity={0.9} />
                      {/* Etiqueta con offset ajustado para evitar solapamientos */}
                      <text
                        x={pos.x + ldx}
                        y={pos.y + ldy}
                        textAnchor={lanchor}
                        fontSize="7" fontFamily="'Oswald', sans-serif" fontWeight="400" letterSpacing="1.2"
                        fill="white" opacity={isActive ? 1 : 0.45}
                        style={{ transition: "opacity 0.3s ease", pointerEvents: "none" }}
                      >
                        {d.city.toUpperCase()}
                      </text>
                    </g>
                  );
                });
              })()}
            </svg>
          </div>

          {/* Panel lateral */}
          <div className="w-full lg:w-[35%]"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(20px)", transition: "all 0.7s ease 0.5s" }}>

            {/* Tarjeta distribuidor activo */}
            {activeD ? (
              <div key={activeD.id} className="border border-border bg-card p-5 mb-4"
                style={{ borderRadius: "2px", animation: "card-in 0.35s ease both" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ width:7, height:7, borderRadius:"50%", background:"#E87A3D", display:"inline-block", boxShadow:"0 0 8px #E87A3D" }} />
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-accent-deep">{activeD.type}</p>
                    </div>
                    <h3 className="font-display text-lg md:text-xl uppercase tracking-wide text-foreground leading-tight">{activeD.name}</h3>
                  </div>
                  <span className="font-body text-[9px] uppercase tracking-[0.2em] text-foreground/30 mt-1 text-right">{activeD.region}</span>
                </div>
                <div className="h-px bg-border mb-4" />
                {/* Dirección */}
                <div className="flex items-start gap-3 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-deep/60 mt-0.5 flex-shrink-0">
                    <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className="font-body text-sm text-foreground/80 leading-snug">{activeD.address}</p>
                    <p className="font-body text-sm text-foreground/60">{activeD.cp} {activeD.city}, {activeD.province}</p>
                  </div>
                </div>
                {/* Teléfono */}
                {activeD.phone && (
                  <a href={`tel:${activeD.phone.replace(/\s/g,"")}`} className="flex items-center gap-3 mb-3 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-deep/60 flex-shrink-0">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
                    </svg>
                    <span className="font-body text-sm text-foreground/80 group-hover:text-accent-deep transition-colors duration-200">{activeD.phone}</span>
                  </a>
                )}
                {/* Email */}
                {activeD.email && (
                  <a href={`mailto:${activeD.email}`} className="flex items-center gap-3 mb-3 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-deep/60 flex-shrink-0">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span className="font-body text-sm text-foreground/80 group-hover:text-accent-deep transition-colors duration-200 break-all">{activeD.email}</span>
                  </a>
                )}
                {!activeD.phone && !activeD.email && (
                  <p className="font-body text-[11px] text-foreground/30 uppercase tracking-[0.15em] mb-3">Contacto disponible próximamente</p>
                )}
                {/* Botones */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {activeD.phone && (
                    <a href={`tel:${activeD.phone.replace(/\s/g,"")}`}
                      className="flex-1 py-2.5 bg-foreground text-background font-display text-[10px] uppercase tracking-[0.2em] text-center hover:bg-accent-deep transition-colors duration-200 min-w-[80px]"
                      style={{ borderRadius:"2px" }}>Llamar</a>
                  )}
                  {activeD.email && (
                    <a href={`mailto:${activeD.email}`}
                      className="flex-1 py-2.5 border border-border text-foreground font-display text-[10px] uppercase tracking-[0.2em] text-center hover:border-accent-deep hover:text-accent-deep transition-colors duration-200 min-w-[80px]"
                      style={{ borderRadius:"2px" }}>Email</a>
                  )}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(activeD.address+", "+activeD.city)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2.5 border border-border text-foreground font-display text-[10px] uppercase tracking-[0.2em] text-center hover:border-accent-deep hover:text-accent-deep transition-colors duration-200 min-w-[80px]"
                    style={{ borderRadius:"2px" }}>Cómo llegar</a>
                </div>
              </div>
            ) : (
              <div className="border border-border bg-card p-6 mb-4 flex flex-col items-center justify-center gap-3 opacity-40"
                style={{ borderRadius:"2px", minHeight:"160px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40 text-center">Introduce tu CP o<br/>selecciona un punto</p>
              </div>
            )}

            {/* Lista */}
            <div className="border border-border bg-card overflow-hidden" style={{ borderRadius:"2px" }}>
              <div className="px-4 py-3 border-b border-border">
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/40">Todos los distribuidores</p>
              </div>
              <div className="divide-y divide-border max-h-[280px] overflow-y-auto">
                {DISTRIBUTORS.map((d, i) => (
                  <button key={d.id}
                    onClick={() => setSelected(d.id === selected ? null : d.id)}
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150"
                    style={{
                      background: activeId === d.id ? "rgba(232,122,61,0.06)" : "transparent",
                      borderLeft: selected === d.id ? "2px solid #E87A3D" : "2px solid transparent",
                      opacity: visible ? 1 : 0,
                      transition: "all 0.2s ease, opacity 0.5s ease",
                      transitionDelay: `${0.6 + i * 0.04}s`,
                    }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", flexShrink:0,
                      background: selected === d.id ? "#E87A3D" : "rgba(232,122,61,0.35)",
                      boxShadow: selected === d.id ? "0 0 6px #E87A3D" : "none",
                      transition: "all 0.3s ease" }} />
                    <span className="font-display text-[10px] uppercase tracking-[0.18em] flex-1 text-left"
                      style={{ color: selected === d.id ? "var(--foreground)" : "rgba(0,31,63,0.6)" }}>
                      {d.name}
                    </span>
                    <span className="font-body text-[9px] uppercase tracking-[0.1em] text-foreground/25 flex-shrink-0">{d.province}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">¿Quieres ser distribuidor?</p>
              <a href="#contacto" className="inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] text-accent-deep hover:text-foreground transition-colors duration-200">
                Contactar <span style={{ fontSize:10 }}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
